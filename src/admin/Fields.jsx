import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { api, errMsg } from '../lib/api.js';
import { LANGS } from '../lib/i18n.js';

export const getIn = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
export const setIn = (o, path, v) => {
  const keys = path.split('.');
  const copy = { ...o };
  let cur = copy;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = v;
    else { cur[k] = { ...(cur[k] || {}) }; cur = cur[k]; }
  });
  return copy;
};

function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg/60">{children}</label>;
}

function I18n({ value = {}, onChange, multiline, rows = 4 }) {
  const [tab, setTab] = useState('uz');
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div>
      <div className="mb-1.5 flex gap-1">
        {LANGS.map((l) => (
          <button
            type="button" key={l} onClick={() => setTab(l)}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase ${tab === l ? 'bg-sec text-white' : 'bg-fg/10 text-fg/70'}`}
          >{l}{value?.[l] ? '' : ' •'}</button>
        ))}
      </div>
      <Tag
        className="input" rows={multiline ? rows : undefined}
        value={value?.[tab] || ''}
        onChange={(e) => onChange({ ...(value || {}), [tab]: e.target.value })}
      />
    </div>
  );
}

function ImageInput({ value, onChange, accept = 'image/*' }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const upload = async (file) => {
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/admin/upload', fd);
      onChange(data.url);
    } catch (e) { setErr(errMsg(e)); }
    setBusy(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://... yoki /uploads/..." />
        <button type="button" className="btn-ghost shrink-0" disabled={busy} onClick={() => ref.current.click()}>
          <Upload size={16} />
        </button>
        <input ref={ref} type="file" hidden accept={accept} onChange={(e) => upload(e.target.files[0])} />
      </div>
      {err && <p className="mt-1 text-xs text-acc">{err}</p>}
      {value && accept.startsWith('image') && <img src={value} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
    </div>
  );
}

/**
 * def: { name|path, label, type, rows?, options? }
 * type: text | textarea | i18n | i18nArea | tags | lines | bool | number | select | image | file
 */
export function Field({ def, value, onChange }) {
  const { type = 'text', label } = def;
  let input;
  switch (type) {
    case 'i18n': input = <I18n value={value} onChange={onChange} />; break;
    case 'i18nArea': input = <I18n value={value} onChange={onChange} multiline rows={def.rows} />; break;
    case 'textarea':
      input = <textarea className="input" rows={def.rows || 4} value={value || ''} onChange={(e) => onChange(e.target.value)} />; break;
    case 'tags':
      input = (
        <input className="input" value={(value || []).join(', ')} placeholder="React, Node.js, MongoDB"
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
      ); break;
    case 'lines':
      input = <textarea className="input font-mono" rows={def.rows || 4} value={(value || []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))} />; break;
    case 'bool':
      return (
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--sec))]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          {label}
        </label>
      );
    case 'number':
      input = <input type="number" className="input" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />; break;
    case 'select':
      input = (
        <select className="input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
          {def.options.map(([v, l]) => <option key={v} value={v} className="text-black">{l}</option>)}
        </select>
      ); break;
    case 'image': input = <ImageInput value={value} onChange={onChange} />; break;
    case 'file': input = <ImageInput value={value} onChange={onChange} accept="application/pdf,image/*" />; break;
    default:
      input = <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  }
  return <div><Label>{label}</Label>{input}</div>;
}
