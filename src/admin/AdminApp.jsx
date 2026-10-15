import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Briefcase, FolderGit2, KeyRound, LogOut, Mail, Moon, Newspaper, Palette, Sun, User, Wrench } from 'lucide-react';
import { api, errMsg } from '../lib/api.js';
import { useApp } from '../context.jsx';
import CrudPage from './CrudPage.jsx';
import { ProfilePage, ThemePage } from './SettingsPages.jsx';
import { AccountPage, MessagesPage } from './MiscPages.jsx';

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ML = { uz: '', ru: '', en: '' };
const pub = [
  { name: 'order', label: 'Tartib raqami', type: 'number' },
  { name: 'published', label: 'Saytda ko\'rsatish', type: 'bool' },
];

const PROJECTS = {
  endpoint: 'projects', title: 'Loyihalar',
  blank: { title: { ...ML }, summary: { ...ML }, architecture: { ...ML }, image: '', tags: [], demoUrl: '', repoUrl: '', featured: false, order: 0, published: true },
  line: (i, tr) => tr(i.title),
  fields: [
    { name: 'title', label: 'Nomi', type: 'i18n' },
    { name: 'summary', label: 'Qisqacha tavsif', type: 'i18nArea', rows: 3 },
    { name: 'architecture', label: 'Arxitektura yondashuvi', type: 'i18nArea', rows: 2 },
    { name: 'image', label: 'Skrinshot / GIF', type: 'image' },
    { name: 'tags', label: 'Texnologiyalar (vergul bilan)', type: 'tags' },
    { name: 'demoUrl', label: 'Live Demo URL' },
    { name: 'repoUrl', label: 'GitHub URL' },
    ...pub,
  ],
};
const SKILLS = {
  endpoint: 'skills', title: 'Texnologiyalar',
  blank: { title: { ...ML }, items: [], order: 0, published: true },
  line: (i, tr) => `${tr(i.title)} — ${i.items.length}`,
  fields: [
    { name: 'title', label: 'Guruh nomi', type: 'i18n' },
    { name: 'items', label: 'Texnologiyalar (vergul bilan)', type: 'tags' },
    ...pub,
  ],
};
const EXPERIENCE = {
  endpoint: 'experience', title: "Tajriba va ta'lim",
  blank: { kind: 'work', title: { ...ML }, place: '', period: '', description: { ...ML }, order: 0, published: true },
  line: (i, tr) => `${tr(i.title)} · ${i.place}`,
  fields: [
    { name: 'kind', label: 'Turi', type: 'select', options: [['work', 'Ish tajribasi'], ['education', "Ta'lim"]] },
    { name: 'title', label: 'Lavozim / yo\'nalish', type: 'i18n' },
    { name: 'place', label: 'Joy (kompaniya / universitet)' },
    { name: 'period', label: 'Davr (2023 — hozir)' },
    { name: 'description', label: 'Tavsif / natijalar', type: 'i18nArea', rows: 3 },
    ...pub,
  ],
};
const POSTS = {
  endpoint: 'posts', title: 'Blog',
  blank: { title: { ...ML }, excerpt: { ...ML }, content: { ...ML }, slug: '', cover: '', tags: [], published: true },
  line: (i, tr) => `${tr(i.title)} (/${i.slug})`,
  fields: [
    { name: 'title', label: 'Sarlavha', type: 'i18n' },
    { name: 'slug', label: 'Slug (lotin harflari, masalan: my-first-post)' },
    { name: 'excerpt', label: 'Qisqacha', type: 'i18nArea', rows: 2 },
    { name: 'content', label: 'Matn (Markdown)', type: 'i18nArea', rows: 12 },
    { name: 'tags', label: 'Teglar', type: 'tags' },
    { name: 'published', label: "Saytda ko'rsatish", type: 'bool' },
  ],
};

function Login() {
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/login', f);
      nav('/admin', { replace: true });
    } catch (er) { setErr(errMsg(er)); }
  };
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm space-y-4 p-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <input className="input" type="email" required autoComplete="username" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="input" type="password" required autoComplete="current-password" placeholder="Parol" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <p role="alert" className="text-sm text-acc">{err}</p>}
        <button className="btn-primary w-full">Kirish</button>
      </form>
    </div>
  );
}

const NAV = [
  ['/admin', 'Profil', User, true],
  ['/admin/theme', 'Ranglar', Palette],
  ['/admin/skills', 'Texnologiyalar', Wrench],
  ['/admin/projects', 'Loyihalar', FolderGit2],
  ['/admin/experience', 'Tajriba', Briefcase],
  ['/admin/posts', 'Blog', Newspaper],
  ['/admin/messages', 'Xabarlar', Mail],
  ['/admin/account', 'Parol', KeyRound],
];

function Shell() {
  const { mode, toggleMode, data } = useApp();
  const nav = useNavigate();
  const [authed, setAuthed] = useState(null);
  useEffect(() => {
    api.get('/admin/me').then(() => setAuthed(true)).catch(() => setAuthed(false));
  }, []);
  const logout = async () => { await api.post('/admin/logout').catch(() => {}); nav('/admin/login'); };

  if (authed === false) return <Navigate to="/admin/login" replace />;
  if (authed === null || !data) return <div className="grid min-h-screen place-items-center font-mono">...</div>;

  const crud = (cfg) => <CrudPage key={cfg.endpoint} {...cfg} />;
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-fg/10 p-4 md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono font-bold"><span className="text-sec">&lt;</span>admin<span className="text-acc"> /&gt;</span></span>
          <div className="flex gap-1">
            <button className="btn-ghost !p-2" onClick={toggleMode} aria-label="Theme">{mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>
            <button className="btn-ghost !p-2" onClick={logout} aria-label="Logout"><LogOut size={15} /></button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {NAV.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-sec text-white' : 'hover:bg-fg/10'}`}>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
          <a href="/" target="_blank" rel="noreferrer" className="mt-2 px-3 py-2 text-sm text-fg/60 hover:text-sec">↗ Saytni ko'rish</a>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Routes>
          <Route index element={<ProfilePage />} />
          <Route path="theme" element={<ThemePage />} />
          <Route path="skills" element={crud(SKILLS)} />
          <Route path="projects" element={crud(PROJECTS)} />
          <Route path="experience" element={crud(EXPERIENCE)} />
          <Route path="posts" element={crud({ ...POSTS, blank: { ...POSTS.blank } })} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Shell />} />
    </Routes>
  );
}
