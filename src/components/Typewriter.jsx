import { useEffect, useState } from 'react';

export default function Typewriter({ lines }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  const list = lines?.length ? lines : [''];
  const cur = list[i % list.length];

  useEffect(() => {
    let id;
    if (!del && n < cur.length) id = setTimeout(() => setN(n + 1), 45);
    else if (!del) id = setTimeout(() => setDel(true), 1600);
    else if (n > 0) id = setTimeout(() => setN(n - 1), 20);
    else { setDel(false); setI((x) => x + 1); }
    return () => clearTimeout(id);
  }, [n, del, cur]);

  return (
    <div className="glass overflow-hidden font-mono text-sm shadow-xl shadow-black/10">
      <div className="flex items-center gap-1.5 border-b border-fg/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-acc" />
        <span className="h-3 w-3 rounded-full bg-sec" />
        <span className="h-3 w-3 rounded-full bg-fg/30" />
        <span className="ml-3 text-xs text-fg/50">server.js</span>
      </div>
      <div className="min-h-[5.5rem] px-4 py-5" aria-hidden="true">
        <span className="text-acc">$ </span>
        <span>{cur.slice(0, n)}</span>
        <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-sec" />
      </div>
    </div>
  );
}
