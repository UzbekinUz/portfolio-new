import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

/** Fon: grid + glow blob'lar + sichqoncha ortidan yuruvchi spotlight */
export function Background() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  useEffect(() => {
    // Sensorli qurilmalarda spotlight kerak emas (batareya/tezlik)
    if (window.matchMedia?.('(pointer: coarse)').matches) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);
  const spot = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgb(var(--sec) / 0.14), transparent 70%)`;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--fg)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--fg)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%)',
        }}
      />
      <motion.div
        className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-sec/25 blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-acc/20 blur-3xl"
        animate={{ x: [0, -70, 0], y: [0, 90, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute inset-0" style={{ background: spot }} />
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-sec to-acc"
      style={{ scaleX }}
    />
  );
}

/** "95+" kabi qiymatni 0 dan sanab chiqadi */
export function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const m = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(String(value));
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || !m) return;
    const c = animate(0, Number(m[2]), { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView]);
  if (!m) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{m[1]}{n}{m[3]}</span>;
}

/** Sichqoncha bo'yicha 3D qiyshayuvchi karta + yorug'lik */
export function Tilt({ children, className = '' }) {
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(260px circle at ${gx}% ${gy}%, rgb(var(--acc) / 0.18), transparent 70%)`;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 8);
    rx.set((0.5 - py) * 8);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`relative ${className}`}
    >
      <motion.div className="pointer-events-none absolute inset-0 z-10 rounded-2xl" style={{ background: glow }} />
      {children}
    </motion.div>
  );
}

/** Cheksiz yuguruvchi yozuv */
export function Marquee({ items, reverse = false }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((it, i) => (
          <span key={i} className="glass whitespace-nowrap px-4 py-2 font-mono text-sm">
            <span className="text-sec">&gt;</span> {it}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/** Sarlavhani harflab ochadi */
export function SplitText({ text, className = '' }) {
  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={{ opacity: 0, y: 40, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.15 + i * 0.035, type: 'spring', stiffness: 160, damping: 16 }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Vertikal chiziq scroll bilan "chiziladi" */
export function DrawLine({ containerRef }) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 80%', 'end 60%'] });
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <>
      <div className="absolute left-0 top-0 h-full w-px bg-fg/15" />
      <motion.div className="absolute left-0 top-0 w-px bg-gradient-to-b from-sec to-acc" style={{ height: h }} />
    </>
  );
}
