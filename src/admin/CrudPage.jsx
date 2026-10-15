import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api, errMsg } from '../lib/api.js';
import { Field } from './Fields.jsx';
import { useApp } from '../context.jsx';

export default function CrudPage({ endpoint, title, fields, blank, line }) {
  const { tr, reload } = useApp();
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get(`/admin/${endpoint}`).then((r) => setItems(r.data)).catch((e) => setErr(errMsg(e)));
  useEffect(() => { load(); }, [endpoint]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      if (edit._id) await api.put(`/admin/${endpoint}/${edit._id}`, edit);
      else await api.post(`/admin/${endpoint}`, edit);
      setEdit(null);
      await load();
      reload();
    } catch (e2) { setErr(errMsg(e2)); }
    setBusy(false);
  };

  const remove = async (it) => {
    if (!confirm('O\'chirishni tasdiqlaysizmi?')) return;
    await api.delete(`/admin/${endpoint}/${it._id}`);
    await load();
    reload();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button className="btn-primary" onClick={() => setEdit(structuredClone(blank))}><Plus size={16} /> Yangi</button>
      </div>
      {err && !edit && <p className="mb-4 text-sm text-acc">{err}</p>}

      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it._id} className="glass flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="truncate font-semibold">
                {line(it, tr)}
                {it.published === false && <span className="badge ml-2">draft</span>}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="btn-ghost !px-3" aria-label="Edit" onClick={() => setEdit(structuredClone(it))}><Pencil size={15} /></button>
              <button className="btn-ghost !px-3 hover:!border-acc hover:!text-acc" aria-label="Delete" onClick={() => remove(it)}><Trash2 size={15} /></button>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-fg/60">Hozircha bo'sh</li>}
      </ul>

      {edit && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
          <form onSubmit={save} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border border-fg/15 bg-base p-6">
            <h2 className="text-xl font-bold">{edit._id ? 'Tahrirlash' : 'Yangi element'}</h2>
            {fields.map((f) => (
              <Field key={f.name} def={f} value={edit[f.name]} onChange={(v) => setEdit((s) => ({ ...s, [f.name]: v }))} />
            ))}
            {err && <p className="text-sm text-acc">{err}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-ghost" onClick={() => { setEdit(null); setErr(''); }}>Bekor qilish</button>
              <button className="btn-primary" disabled={busy}>Saqlash</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
