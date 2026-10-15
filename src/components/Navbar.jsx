import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useApp } from '../context.jsx';
import { LANGS } from '../lib/i18n.js';

export default function Navbar() {
  const { t, lang, setLang, mode, toggleMode, data } = useApp();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const nav = useNavigate();
  const s = data.settings;

  const links = [
    ['about', 'nav.about'],
    ['projects', 'nav.projects'],
    ...(s.sections?.experience ? [['experience', 'nav.experience']] : []),
    ['contact', 'nav.contact'],
  ];

  const go = (id) => {
    setOpen(false);
    if (pathname !== '/') nav('/', { state: { scrollTo: id } });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-fg/10 bg-base/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-mono text-lg font-bold">
          <span className="text-sec">&lt;</span>{s.profile.name?.split(' ')[0] || 'dev'}<span className="text-acc"> /&gt;</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map(([id, k]) => (
            <button key={id} onClick={() => go(id)} className="text-sm text-fg/75 transition hover:text-sec">{t(k)}</button>
          ))}
          {s.sections?.blog && <Link to="/blog" className="text-sm text-fg/75 transition hover:text-sec">{t('nav.blog')}</Link>}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-fg/15 p-0.5" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition ${lang === l ? 'bg-sec text-white' : 'text-fg/70 hover:text-fg'}`}
              >{l}</button>
            ))}
          </div>
          <button onClick={toggleMode} aria-label="Toggle theme" className="rounded-lg border border-fg/15 p-2 transition hover:bg-fg/10">
            {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="rounded-lg border border-fg/15 p-2 md:hidden">
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-fg/10 bg-base px-4 py-3 md:hidden">
          {links.map(([id, k]) => (
            <button key={id} onClick={() => go(id)} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-fg/10">{t(k)}</button>
          ))}
          {s.sections?.blog && (
            <Link to="/blog" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-fg/10">{t('nav.blog')}</Link>
          )}
        </nav>
      )}
    </header>
  );
}
