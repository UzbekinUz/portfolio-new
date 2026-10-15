import { useEffect, useState } from 'react';
import { MailOpen, Trash2 } from 'lucide-react';
import { api, errMsg } from '../lib/api.js';

export function MessagesPage() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/admin/messages').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const toggle = async (m) => { await api.put(`/admin/messages/${m._id}`, { read: !m.read }); load(); };
  const remove = async (m) => { if (confirm("O'chirilsinmi?")) { await api.delete(`/admin/messages/${m._id}`); load(); } };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Xabarlar</h1>
      <ul className="space-y-3">
        {items.map((m) => (
          <li key={m._id} className={`glass p-4 ${m.read ? 'opacity-60' : 'border-sec/50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-semibold">{m.name}</span>{' '}
                <a className="text-sm text-sec hover:underline" href={`mailto:${m.email}`}>{m.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <time className="font-mono text-xs text-fg/60">{new Date(m.createdAt).toLocaleString()}</time>
                <button className="btn-ghost !px-2.5 !py-1.5" aria-label="Toggle read" onClick={() => toggle(m)}><MailOpen size={15} /></button>
                <button className="btn-ghost !px-2.5 !py-1.5" aria-label="Delete" onClick={() => remove(m)}><Trash2 size={15} /></button>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{m.text}</p>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-fg/60">Xabarlar yo'q</li>}
      </ul>
    </div>
  );
}

export function AccountPage() {
  const [f, setF] = useState({ current: '', next: '' });
  const [msg, setMsg] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/password', f);
      setMsg("Parol o'zgartirildi ✓");
      setF({ current: '', next: '' });
    } catch (er) { setMsg(errMsg(er)); }
  };
  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Parolni o'zgartirish</h1>
      <input className="input" type="password" required autoComplete="current-password" placeholder="Joriy parol" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} />
      <input className="input" type="password" required minLength={10} autoComplete="new-password" placeholder="Yangi parol (kamida 10 belgi)" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} />
      <button className="btn-primary">Saqlash</button>
      {msg && <p className="text-sm" role="status">{msg}</p>}
    </form>
  );
}
