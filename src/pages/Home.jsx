import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Briefcase, ChevronDown, Cpu, Database, Download, ExternalLink, Gauge, Github, GraduationCap,
  Layers, MapPin, Palette, Rocket, ShieldCheck, Sparkles, Terminal, Server,
} from 'lucide-react';
import { useApp } from '../context.jsx';
import { api } from '../lib/api.js';
import { CONTENT } from '../lib/i18n.js';
import Typewriter from '../components/Typewriter.jsx';
import Reveal from '../components/Reveal.jsx';
import Socials from '../components/Socials.jsx';
import { Counter, DrawLine, Marquee, SplitText, Tilt } from '../components/Fx.jsx';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function SectionTitle({ children, index }) {
  return (
    <motion.div
      className="mb-10 flex items-center gap-4"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-mono text-sm text-sec">0{index}.</span>
      <h2 className="text-3xl font-bold sm:text-4xl">{children}</h2>
      <span className="hidden h-px flex-1 bg-gradient-to-r from-fg/25 to-transparent sm:block" />
    </motion.div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const { t, tr, data, lang } = useApp();
  const c = CONTENT[lang];
  const { profile: p, typewriter } = data.settings;
  const chips = useMemo(() => data.skills.flatMap((g) => g.items).slice(0, 6), [data.skills]);
  const pos = ['-left-3 top-2', '-right-2 top-10', '-left-6 bottom-24', '-right-4 bottom-10', 'left-10 -bottom-6', 'right-16 -top-5'];

  return (
    <section className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
      <div>
        {p.available && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="glass mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {tr(p.availableText)}
          </motion.span>
        )}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-mono text-sm text-sec">
          {t('hero.hi')}
        </motion.p>
        <h1 className="mt-2 text-5xl font-extrabold leading-[1.05] sm:text-7xl">
          {(p.name || '').trim().split(/\s+/).map((word, i) => (
            <span key={i} className="block"><SplitText text={word} /></span>
          ))}
        </h1>
        <motion.h2
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
          className="mt-3 bg-gradient-to-r from-sec to-acc bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
        >
          {tr(p.role)}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="mt-5 max-w-xl text-lg text-fg/75"
        >
          {tr(p.tagline)}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-primary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            {t('hero.projects')} <ArrowRight size={16} />
          </motion.button>
          {p.resumeUrl ? (
            <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-ghost"
              href={p.resumeUrl} target="_blank" rel="noopener noreferrer" download>
              <Download size={16} /> {t('hero.resume')}
            </motion.a>
          ) : (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-ghost"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('hero.contact')}
            </motion.button>
          )}
        </motion.div>
        <Socials profile={p} className="mt-8" />
      </div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <Typewriter lines={typewriter} />
        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            className={`glass absolute hidden px-3 py-1.5 font-mono text-xs shadow-lg sm:block ${pos[i]}`}
            animate={{ y: [0, i % 2 ? -12 : 12, 0] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
          >
            {chip}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-fg/50 md:flex"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
      >
        {c.scroll}
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}

/* ---------------- STACK MARQUEE ---------------- */
function StackStrip() {
  const { data, lang } = useApp();
  const items = data.skills.flatMap((g) => g.items);
  if (!items.length) return null;
  const half = Math.ceil(items.length / 2);
  return (
    <section aria-label={CONTENT[lang].stackTitle} className="border-y border-fg/10 py-6">
      <Marquee items={items.slice(0, half)} />
      <Marquee items={items.slice(half).length ? items.slice(half) : items} reverse />
    </section>
  );
}

/* ---------------- ABOUT (bento) ---------------- */
function CodeCard() {
  const { data, tr } = useApp();
  const p = data.settings.profile;
  const stack = data.skills.flatMap((g) => g.items).slice(0, 5);
  const K = ({ children }) => <span className="text-acc">{children}</span>;
  const S = ({ children }) => <span className="text-sec">{children}</span>;
  return (
    <div className="glass h-full overflow-hidden font-mono text-xs leading-6 sm:text-sm">
      <div className="flex items-center gap-2 border-b border-fg/10 px-4 py-2 text-fg/60">
        <Terminal size={14} /> developer.json
      </div>
      <pre className="overflow-x-auto p-4">
        <code>
{'{\n'}
{'  '}<K>"name"</K>: <S>"{p.name}"</S>,{'\n'}
{'  '}<K>"role"</K>: <S>"{tr(p.role)}"</S>,{'\n'}
{'  '}<K>"stack"</K>: [{stack.map((s, i) => <span key={s}><S>"{s}"</S>{i < stack.length - 1 ? ', ' : ''}</span>)}],{'\n'}
{'  '}<K>"openToWork"</K>: <S>{String(!!p.available)}</S>,{'\n'}
{'  '}<K>"coffee"</K>: <S>"∞"</S>{'\n'}
{'}'}
        </code>
      </pre>
    </div>
  );
}

function About() {
  const { t, tr, data, lang } = useApp();
  const c = CONTENT[lang];
  const { profile: p, stats } = data.settings;
  const now = (data.settings.now || []).map(tr).filter(Boolean);
  const principles = (data.settings.principles || []).map(tr).filter(Boolean);
  return (
    <section id="about" className="section">
      <SectionTitle index={1}>{t('about.title')}</SectionTitle>
      <motion.div
        variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-4"
      >
        <motion.div variants={item} className="glass p-6 md:col-span-2 md:row-span-2">
          <div className="flex items-start gap-4">
            {p.avatar ? (
              <img src={p.avatar} alt={p.name} loading="lazy" className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-sec" />
            ) : (
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sec to-acc text-3xl font-extrabold text-white">
                {(p.name || '?')[0]}
              </div>
            )}
            <div>
              <div className="text-xl font-bold">{p.name}</div>
              <div className="text-sm text-sec">{tr(p.role)}</div>
              {p.location && <div className="mt-1 flex items-center gap-1 text-xs text-fg/60"><MapPin size={12} /> {tr(p.location)}</div>}
            </div>
          </div>
          <p className="mt-5 leading-7 text-fg/85">{tr(p.about)}</p>
        </motion.div>

        {stats.map((s, i) => (
          <motion.div key={i} variants={item} whileHover={{ y: -4 }} className="glass flex flex-col justify-center p-6">
            <div className={`text-4xl font-extrabold ${i % 2 ? 'text-acc' : 'text-sec'}`}><Counter value={s.value} /></div>
            <div className="mt-1 text-sm text-fg/70">{tr(s.label)}</div>
          </motion.div>
        ))}

        {now.length > 0 && (
          <motion.div variants={item} className="glass p-6">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-sm text-sec"><Sparkles size={14} /> {c.nowTitle}</h3>
            <ul className="space-y-2 text-sm text-fg/80">
              {now.map((n) => (
                <li key={n} className="flex gap-2"><span className="text-acc">▹</span>{n}</li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div variants={item} className="md:col-span-2"><CodeCard /></motion.div>

        {data.skills.map((g) => (
          <motion.div key={g._id} variants={item} className="glass p-6 md:col-span-2">
            <h3 className="mb-3 font-mono text-sm text-sec">{tr(g.title)}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <motion.span key={it} whileHover={{ scale: 1.1, y: -2 }} className="badge cursor-default">{it}</motion.span>
              ))}
            </div>
          </motion.div>
        ))}

        {principles.length > 0 && (
          <motion.div variants={item} className="glass p-6 md:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-sm text-sec"><Layers size={14} /> {c.principlesTitle}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {principles.map((x) => (
                <div key={x} className="rounded-xl bg-fg/5 px-3 py-2 text-sm">{x}</div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
const SERVICE_ICONS = [Cpu, Server, Palette, Gauge, ShieldCheck, Rocket];

function Services() {
  const { lang } = useApp();
  const c = CONTENT[lang];
  return (
    <section id="services" className="section">
      <SectionTitle index={2}>{c.servicesTitle}</SectionTitle>
      <motion.div
        variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {c.services.map(([title, desc], i) => {
          const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
          return (
            <motion.div key={title} variants={item}>
              <Tilt className="h-full">
                <div className="glass h-full p-6">
                  <motion.div
                    whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                    className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sec to-acc text-white"
                  >
                    <Icon size={22} />
                  </motion.div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-fg/70">{desc}</p>
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ---------------- PROJECTS ---------------- */
function Projects() {
  const { t, tr, data } = useApp();
  const [tag, setTag] = useState('all');
  const tags = useMemo(() => ['all', ...new Set(data.projects.flatMap((p) => p.tags))], [data.projects]);
  const list = tag === 'all' ? data.projects : data.projects.filter((p) => p.tags.includes(tag));

  return (
    <section id="projects" className="section">
      <SectionTitle index={3}>{t('projects.title')}</SectionTitle>
      {tags.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((x) => (
            <button key={x} onClick={() => setTag(x)} aria-pressed={tag === x}
              className={`rounded-full border px-3.5 py-1 font-mono text-xs transition ${tag === x ? 'border-sec bg-sec text-white' : 'border-fg/20 hover:border-sec'}`}>
              {x}
            </button>
          ))}
        </div>
      )}
      <motion.div layout className="grid gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((pr, i) => (
            <motion.div
              layout key={pr._id}
              initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Tilt className="h-full">
                <article className="glass group flex h-full flex-col overflow-hidden">
                  <div className="relative overflow-hidden">
                    {pr.image ? (
                      <img src={pr.image} alt={tr(pr.title)} loading="lazy"
                        className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="grid aspect-video w-full place-items-center bg-gradient-to-br from-sec/30 to-acc/30 font-mono text-5xl text-fg/40 transition duration-500 group-hover:scale-105">
                        {'</>'}
                      </div>
                    )}
                    {pr.featured && <span className="absolute left-3 top-3 rounded-full bg-acc px-2.5 py-0.5 text-xs font-semibold text-white">★ Featured</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold">{tr(pr.title)}</h3>
                    <p className="mt-2 text-fg/75">{tr(pr.summary)}</p>
                    {tr(pr.architecture) && (
                      <p className="mt-3 rounded-xl bg-fg/5 p-3 font-mono text-xs leading-5 text-fg/75">
                        <span className="text-acc">// {t('projects.arch')}</span><br />{tr(pr.architecture)}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {pr.tags.map((x) => <span key={x} className="badge">{x}</span>)}
                    </div>
                    <div className="mt-auto flex gap-4 pt-5">
                      {pr.demoUrl && pr.demoUrl !== '#' && (
                        <a href={pr.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sec hover:underline">
                          <ExternalLink size={15} /> {t('projects.demo')}
                        </a>
                      )}
                      {pr.repoUrl && pr.repoUrl !== '#' && (
                        <a href={pr.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-sec">
                          <Github size={15} /> {t('projects.code')}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Tilt>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ---------------- PROCESS ---------------- */
function Process() {
  const { lang } = useApp();
  const c = CONTENT[lang];
  return (
    <section id="process" className="section">
      <SectionTitle index={4}>{c.processTitle}</SectionTitle>
      <motion.ol
        variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
        className="grid gap-4 md:grid-cols-4"
      >
        {c.process.map(([title, desc], i) => (
          <motion.li key={title} variants={item} className="glass relative p-6">
            <span className="font-mono text-5xl font-extrabold text-fg/10">0{i + 1}</span>
            <h3 className="mt-2 font-bold text-sec">{title}</h3>
            <p className="mt-2 text-sm text-fg/70">{desc}</p>
            {i < c.process.length - 1 && (
              <motion.span
                aria-hidden="true"
                className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-acc md:block"
                animate={{ x: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.span>
            )}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

/* ---------------- EXPERIENCE ---------------- */
function Experience() {
  const { t, tr, data } = useApp();
  const ref = useRef(null);
  if (!data.settings.sections?.experience || !data.experience.length) return null;
  const groups = [['work', 'exp.work', Briefcase], ['education', 'exp.edu', GraduationCap]];
  return (
    <section id="experience" className="section">
      <SectionTitle index={5}>{t('exp.title')}</SectionTitle>
      <div className="grid gap-10 md:grid-cols-2">
        {groups.map(([kind, label, Icon]) => {
          const items = data.experience.filter((e) => e.kind === kind);
          if (!items.length) return null;
          return (
            <div key={kind}>
              <h3 className="mb-5 flex items-center gap-2 font-semibold text-sec"><Icon size={18} /> {t(label)}</h3>
              <ol ref={kind === 'work' ? ref : undefined} className="relative space-y-6 pl-7">
                <DrawLine containerRef={ref} />
                {items.map((e) => (
                  <motion.li
                    key={e._id} className="relative"
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }}
                  >
                    <motion.span
                      className="absolute -left-[33px] top-1.5 h-3 w-3 rounded-full bg-acc ring-4 ring-base"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    />
                    <div className="glass p-4">
                      <div className="font-mono text-xs text-fg/60">{e.period}</div>
                      <div className="font-semibold">{tr(e.title)}</div>
                      <div className="text-sm text-sec">{e.place}</div>
                      {tr(e.description) && <p className="mt-1 text-sm text-fg/75">{tr(e.description)}</p>}
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- BLOG PREVIEW ---------------- */
function BlogPreview() {
  const { t, tr, data } = useApp();
  if (!data.settings.sections?.blog || !data.posts.length) return null;
  return (
    <section id="blog" className="section">
      <SectionTitle index={6}>{t('blog.title')}</SectionTitle>
      <div className="grid gap-4 md:grid-cols-3">
        {data.posts.slice(0, 3).map((p) => (
          <Reveal key={p._id}>
            <Link to={`/blog/${p.slug}`} className="glass block h-full p-6 transition hover:-translate-y-1 hover:border-sec/60">
              <h3 className="font-bold">{tr(p.title)}</h3>
              <p className="mt-2 text-sm text-fg/70">{tr(p.excerpt)}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-sec">{t('blog.read')} →</span>
            </Link>
          </Reveal>
        ))}
      </div>
      <Link to="/blog" className="mt-6 inline-block text-sm font-semibold text-sec hover:underline">{t('blog.all')} →</Link>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact() {
  const { t, data } = useApp();
  const p = data.settings.profile;
  const [form, setForm] = useState({ name: '', email: '', text: '', website: '' });
  const [state, setState] = useState('idle');

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    try {
      await api.post('/contact', form);
      setState('sent');
      setForm({ name: '', email: '', text: '', website: '' });
    } catch { setState('error'); }
  };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" className="section">
      <SectionTitle index={7}>{t('contact.title')}</SectionTitle>
      <div className="grid gap-8 md:grid-cols-2">
        <Reveal>
          <p className="text-2xl font-bold leading-snug sm:text-3xl">{t('contact.sub')}</p>
          {p.email && <a href={`mailto:${p.email}`} className="mt-6 block font-mono text-lg text-sec hover:underline">{p.email}</a>}
          {p.phone && <p className="mt-1 font-mono text-sm text-fg/70">{p.phone}</p>}
          <Socials profile={p} className="mt-6" />
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="glass space-y-4 p-6">
            <input className="input" required maxLength={100} placeholder={t('contact.name')} aria-label={t('contact.name')} value={form.name} onChange={set('name')} />
            <input className="input" required type="email" maxLength={200} placeholder={t('contact.email')} aria-label={t('contact.email')} value={form.email} onChange={set('email')} />
            <textarea className="input min-h-32" required minLength={5} maxLength={3000} placeholder={t('contact.message')} aria-label={t('contact.message')} value={form.text} onChange={set('text')} />
            <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set('website')} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full" disabled={state === 'sending'}>
              {t('contact.send')} <ArrowRight size={16} />
            </motion.button>
            <AnimatePresence>
              {state === 'sent' && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className="text-sm text-green-500">{t('contact.sent')}</motion.p>}
              {state === 'error' && <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="alert" className="text-sm text-acc">{t('contact.error')}</motion.p>}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const loc = useLocation();
  useEffect(() => {
    const id = loc.state?.scrollTo;
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [loc.state]);

  return (
    <>
      <Hero />
      <StackStrip />
      <About />
      <Services />
      <Projects />
      <Process />
      <Experience />
      <BlogPreview />
      <Contact />
    </>
  );
}
