import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useApp } from '../context.jsx';

export default function Blog() {
  const { t, tr, data, lang } = useApp();
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const tags = useMemo(() => [...new Set(data.posts.flatMap((p) => p.tags || []))], [data.posts]);
  const list = data.posts.filter((p) => {
    if (tag && !(p.tags || []).includes(tag)) return false;
    const needle = q.trim().toLowerCase();
    return !needle || `${tr(p.title)} ${tr(p.excerpt)}`.toLowerCase().includes(needle);
  });

  return (
    <section className="section pt-28">
      <h1 className="mb-8 text-4xl font-bold"><span className="text-sec">#</span> {t('blog.title')}</h1>
      {data.posts.length > 3 && (
        <div className="mb-8 space-y-3">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg/50" />
            <input className="input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label="Search" />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {['', ...tags].map((x) => (
                <button key={x || 'all'} onClick={() => setTag(x)} aria-pressed={tag === x}
                  className={`rounded-full border px-3 py-1 font-mono text-xs ${tag === x ? 'border-sec bg-sec text-white' : 'border-fg/20'}`}>
                  {x || 'all'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {list.length === 0 && <p className="text-fg/70">{t('blog.empty')}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <Link key={p._id} to={`/blog/${p.slug}`} className="glass block p-6 transition hover:-translate-y-1 hover:border-sec/60">
            <time className="font-mono text-xs text-fg/60">{new Date(p.createdAt).toLocaleDateString(lang)}</time>
            <h2 className="mt-1 text-xl font-bold">{tr(p.title)}</h2>
            <p className="mt-2 text-fg/75">{tr(p.excerpt)}</p>
            <div className="mt-3 flex flex-wrap gap-2">{p.tags?.map((x) => <span key={x} className="badge">{x}</span>)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
