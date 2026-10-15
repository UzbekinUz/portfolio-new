import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { api } from './lib/api';
import { UI, LANGS } from './lib/i18n';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const store = {
  get: (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function applyTheme(colors) {
  if (!colors) return;
  const root = document.documentElement;
  const map = { '--bg': colors.bg, '--sec': colors.secondary, '--acc': colors.accent, '--fg': colors.text };
  for (const [k, v] of Object.entries(map)) {
    const rgb = hexToRgb(v);
    if (rgb) root.style.setProperty(k, rgb);
  }
}

export function AppProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const s = store.get('mode');
    if (s) return s;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [lang, setLangState] = useState(() => {
    const s = store.get('lang');
    return LANGS.includes(s) ? s : 'uz';
  });
  // stale-while-revalidate: oxirgi javob darhol ko'rsatiladi, fonda yangilanadi
  // (backend "uxlab" qolgan bo'lsa ham foydalanuvchi bo'sh ekran ko'rmaydi)
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('site_cache') || 'null'); } catch { return null; }
  });
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    api.get('/site')
      .then((r) => {
        setData(r.data);
        setError(false);
        try {
          localStorage.setItem('site_cache', JSON.stringify(r.data));
          localStorage.setItem('theme_cache', JSON.stringify(r.data.settings?.theme || null));
        } catch { /* ignore */ }
      })
      .catch(() => setError(true));
  }, []);
  useEffect(load, [load]);

  const themeColors = data?.settings?.theme?.[mode];
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
    store.set('mode', mode);
    applyTheme(themeColors);
  }, [mode, themeColors]);

  useEffect(() => {
    document.documentElement.lang = lang;
    store.set('lang', lang);
  }, [lang]);

  const value = useMemo(() => {
    const t = (k) => UI[lang]?.[k] ?? UI.en[k] ?? k;
    // Ko'p tilli maydonni tanlangan tilga o'giradi (bo'sh bo'lsa boshqa tilga fallback)
    const tr = (v) => {
      if (v == null) return '';
      if (typeof v === 'string') return v;
      return v[lang] || v.en || v.uz || v.ru || '';
    };
    return {
      mode, setMode, toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      lang, setLang: setLangState, t, tr,
      data, setData, error, reload: load,
    };
  }, [mode, lang, data, error, load]);

  return (
    <Ctx.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}
