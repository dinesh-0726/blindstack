import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loading, Empty, Alert, Avatar } from '../components/UI';

export default function UsersPage({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [form, setForm] = useState({ name: '', email: '' });
  const [msg, setMsg] = useState(null);

  const load = () => api('/users').then(u => { if (u) setUsers(u); });

  useEffect(() => { load(); }, []);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) return flash('Please fill in all fields.', 'error');
    const r = await api('/users', { method: 'POST', body: JSON.stringify(form) });
    if (r) { flash('User registered!'); setForm({ name: '', email: '' }); load(); }
    else flash('Error creating user.', 'error');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Users</div>
        <div className="page-subtitle">Register & manage platform members</div>
      </div>

      <div className="grid-2">
        {/* Register form */}
        <div className="card">
          <div className="card-title">Register New User</div>
          <Alert msg={msg?.text} type={msg?.type} />
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              className="input"
              placeholder="e.g. Alex Kim"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input
              className="input"
              placeholder="alex@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
          <button className="btn btn-primary" onClick={submit}>+ Register</button>
        </div>

        {/* User list */}
        <div className="card">
          <div className="card-title">All Users ({users.length})</div>
          {users.length === 0 ? <Empty icon="👤" text="No users registered yet." /> : (
            <div>
              {users.map(u => (
                <div key={u.id} className="user-row">
                  <Avatar name={u.name} gradient="linear-gradient(135deg,#6ee7b7,#6366f1)" size={38} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{u.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{u.email} · ID #{u.id}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
