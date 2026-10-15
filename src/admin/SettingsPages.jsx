import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api, errMsg } from '../lib/api.js';
import { Field, getIn, setIn } from './Fields.jsx';
import { useApp } from '../context.jsx';

const DEFAULT_THEME = {
  dark: { bg: '#282B4A', secondary: '#EC5E27', accent: '#FF3E6C', text: '#F6F5FB' },
  light: { bg: '#F3F6FC', secondary: '#2F4BDB', accent: '#0891B2', text: '#12183A' },
};

function useSettings() {
  const { reload } = useApp();
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState('');
  useEffect(() => { api.get('/admin/settings').then((r) => setS(r.data)).catch((e) => setMsg(errMsg(e))); }, []);

  const save = async (next = s) => {
    setMsg('');
    try {
      const { data } = await api.put('/admin/settings', next);
      setS(data);
      reload();
      setMsg('Saqlandi ✓');
    } catch (e) { setMsg(errMsg(e)); }
  };
  return { s, setS, save, msg };
}

function SaveBar({ onSave, msg }) {
  return (
    <div className="sticky bottom-4 mt-6 flex items-center gap-3">
      <button className="btn-primary" onClick={() => onSave()}>Saqlash</button>
      {msg && <span className="text-sm" role="status">{msg}</span>}
    </div>
  );
}

const PROFILE_FIELDS = [
  { path: 'profile.name', label: 'Ism' },
  { path: 'profile.role', label: 'Lavozim', type: 'i18n' },
  { path: 'profile.tagline', label: 'Shior (tagline)', type: 'i18nArea', rows: 3 },
  { path: 'profile.about', label: 'Men haqimda', type: 'i18nArea', rows: 5 },
  { path: 'profile.location', label: 'Manzil', type: 'i18n' },
  { path: 'profile.available', label: 'Ishga ochiq (🟢 status)', type: 'bool' },
  { path: 'profile.availableText', label: 'Status matni', type: 'i18n' },
  { path: 'profile.avatar', label: 'Avatar', type: 'image' },
  { path: 'profile.resumeUrl', label: 'Rezyume (PDF)', type: 'file' },
  { path: 'profile.email', label: 'Email' },
  { path: 'profile.phone', label: 'Telefon' },
  { path: 'profile.github', label: 'GitHub URL' },
  { path: 'profile.linkedin', label: 'LinkedIn URL' },
  { path: 'profile.telegram', label: 'Telegram URL' },
  { path: 'profile.instagram', label: 'Instagram URL' },
  { path: 'typewriter', label: 'Hero terminal qatorlari (har biri yangi qatorda)', type: 'lines' },
  { path: 'sections.experience', label: "Tajriba bo'limini ko'rsatish", type: 'bool' },
  { path: 'sections.blog', label: "Blog bo'limini ko'rsatish", type: 'bool' },
  { path: 'seo.title', label: 'SEO sarlavha', type: 'i18n' },
  { path: 'seo.description', label: 'SEO tavsif', type: 'i18nArea', rows: 2 },
];

// Ko'p tilli qatorlar ro'yxati (masalan "Hozir", "Tamoyillar")
function I18nList({ label, hint, value = [], onChange }) {
  const strip = (v) => ({ uz: v?.uz || '', ru: v?.ru || '', en: v?.en || '' });
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-fg/60">{label}</span>
        <button type="button" className="btn-ghost !py-1.5" onClick={() => onChange([...value.map(strip), { uz: '', ru: '', en: '' }])}><Plus size={14} /></button>
      </div>
      {hint && <p className="mb-2 text-xs text-fg/50">{hint}</p>}
      <div className="space-y-3">
        {value.map((v, i) => (
          <div key={i} className="glass flex items-start gap-2 p-3">
            <div className="flex-1">
              <Field def={{ label: '', type: 'i18n' }} value={strip(v)}
                onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : strip(x))))} />
            </div>
            <button type="button" className="btn-ghost !px-3" aria-label="Delete" onClick={() => onChange(value.filter((_, j) => j !== i).map(strip))}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { s, setS, save, msg } = useSettings();
  if (!s) return <p>{msg || '...'}</p>;
  const stats = s.stats || [];
  const setStats = (v) => setS({ ...s, stats: v });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profil va sayt sozlamalari</h1>
      <div className="space-y-5">
        {PROFILE_FIELDS.map((f) => (
          <Field key={f.path} def={f} value={getIn(s, f.path)} onChange={(v) => setS(setIn(s, f.path, v))} />
        ))}

        <I18nList label='"Hozir" bo&apos;limi' hint="Bo'sh bo'lsa saytda ko'rinmaydi." value={s.now || []} onChange={(v) => setS({ ...s, now: v })} />
        <I18nList label="Tamoyillar" hint="Bo'sh bo'lsa saytda ko'rinmaydi." value={s.principles || []} onChange={(v) => setS({ ...s, principles: v })} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-fg/60">Statistika kartalari</span>
            <button className="btn-ghost !py-1.5" onClick={() => setStats([...stats, { value: '', label: { uz: '', ru: '', en: '' } }])}><Plus size={14} /></button>
          </div>
          <div className="space-y-3">
            {stats.map((st, i) => (
              <div key={i} className="glass space-y-3 p-4">
                <div className="flex gap-2">
                  <input className="input" placeholder="95+" value={st.value || ''} onChange={(e) => setStats(stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                  <button className="btn-ghost !px-3" aria-label="Delete" onClick={() => setStats(stats.filter((_, j) => j !== i))}><Trash2 size={15} /></button>
                </div>
                <Field def={{ label: 'Yozuv', type: 'i18n' }} value={st.label} onChange={(v) => setStats(stats.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <SaveBar onSave={save} msg={msg} />
    </div>
  );
}

// WCAG kontrast nisbati
function luminance(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
function contrast(a, b) {
  const la = luminance(a), lb = luminance(b);
  if (la == null || lb == null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
function ContrastNote({ colors }) {
  const rows = [
    ['Matn / fon', contrast(colors?.text, colors?.bg), 4.5],
    ['Ikkinchi rang / fon', contrast(colors?.secondary, colors?.bg), 3],
    ["Urg'u / fon", contrast(colors?.accent, colors?.bg), 3],
  ];
  return (
    <ul className="mt-4 space-y-1 text-xs">
      {rows.map(([label, ratio, min]) => {
        if (ratio == null) return null;
        const ok = ratio >= min;
        return (
          <li key={label} className={ok ? 'text-fg/60' : 'font-semibold text-acc'}>
            {ok ? '✓' : '⚠'} {label}: {ratio.toFixed(1)}:1 {ok ? '' : `(kamida ${min}:1 kerak — o'qish qiyin)`}
          </li>
        );
      })}
    </ul>
  );
}

const COLOR_ROLES = [
  ['bg', 'Asosiy fon (60%)'],
  ['secondary', 'Ikkinchi rang (30%)'],
  ['accent', 'Urg\'u rangi (10%)'],
  ['text', 'Matn rangi'],
];

export function ThemePage() {
  const { setData, mode, setMode } = useApp();
  const { s, setS, save, msg } = useSettings();
  if (!s) return <p>{msg || '...'}</p>;
  const theme = s.theme || DEFAULT_THEME;

  // Jonli ko'rinish: o'zgarishni saytga darhol qo'llaymiz
  const update = (next) => {
    setS({ ...s, theme: next });
    setData((d) => (d ? { ...d, settings: { ...d.settings, theme: next } } : d));
  };
  const setColor = (m, k, v) => update({ ...theme, [m]: { ...theme[m], [k]: v } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Ranglar</h1>
      <p className="mb-6 text-sm text-fg/70">O'zgarishlar darhol ko'rinadi; "Saqlash" bosilganda barcha foydalanuvchilarga qo'llanadi.</p>

      <div className="grid gap-6 md:grid-cols-2">
        {['dark', 'light'].map((m) => (
          <div key={m} className="glass p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold uppercase">{m === 'dark' ? 'Dark (night)' : 'Light'} mode</h2>
              <button className={mode === m ? 'badge' : 'btn-ghost !py-1 text-xs'} onClick={() => setMode(m)}>
                {mode === m ? 'Hozir faol' : "Ko'rish"}
              </button>
            </div>
            <div className="space-y-3">
              {COLOR_ROLES.map(([k, label]) => (
                <div key={k} className="flex items-center gap-3">
                  <input type="color" aria-label={label} className="h-10 w-12 cursor-pointer rounded-lg border border-fg/20 bg-transparent"
                    value={/^#[0-9a-f]{6}$/i.test(theme[m]?.[k] || '') ? theme[m][k] : '#000000'}
                    onChange={(e) => setColor(m, k, e.target.value)} />
                  <input className="input font-mono" value={theme[m]?.[k] || ''} onChange={(e) => setColor(m, k, e.target.value)} />
                  <span className="hidden w-40 shrink-0 text-xs text-fg/60 sm:block">{label}</span>
                </div>
              ))}
            </div>
            <ContrastNote colors={theme[m]} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="btn-primary" onClick={() => save()}>Saqlash</button>
        <button className="btn-ghost" onClick={() => update(DEFAULT_THEME)}>Standart ranglarga qaytarish</button>
        {msg && <span className="text-sm" role="status">{msg}</span>}
      </div>
    </div>
  );
}
