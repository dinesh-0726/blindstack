import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loading, Empty, Alert } from '../components/UI';

export default function SkillsPage() {
  const [skills, setSkills] = useState(null);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState(null);

  const load = () => api('/skills').then(setSkills);
  useEffect(() => { load(); }, []);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const submit = async () => {
    if (!name.trim()) return;
    const r = await api('/skills', { method: 'POST', body: JSON.stringify({ name: name.trim() }) });
    if (r) { flash('Skill added to library!'); setName(''); load(); }
    else flash('Error adding skill.', 'error');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Skills Library</div>
        <div className="page-subtitle">All available skills on the platform</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Add New Skill</div>
          <Alert msg={msg?.text} type={msg?.type} />
          <div className="form-group">
            <label className="label">Skill Name</label>
            <input
              className="input"
              placeholder="e.g. Python, UX Design, SQL..."
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
          <button className="btn btn-primary" onClick={submit}>+ Add Skill</button>
        </div>

        <div className="card">
          <div className="card-title">
            All Skills {skills ? `(${skills.length})` : ''}
          </div>
          {!skills ? <Loading /> : skills.length === 0 ? (
            <Empty icon="🧩" text="No skills in library yet." />
          ) : (
            <div className="pill-list">
              {skills.map(s => (
                <span key={s.id} className="pill">
                  <span className="dot dot-gold" />
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
