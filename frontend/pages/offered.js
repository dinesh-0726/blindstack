import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loading, Empty, Alert } from '../components/UI';

const LEVEL_COLORS = {
  BEGINNER:     'var(--accent)',
  INTERMEDIATE: 'var(--accent3)',
  ADVANCED:     'var(--accent2)',
};

export default function OfferedPage({ userId }) {
  const [skills, setSkills] = useState([]);
  const [offered, setOffered] = useState(null);
  const [form, setForm] = useState({ skillId: '', level: 'BEGINNER' });
  const [msg, setMsg] = useState(null);

  const load = () => {
    api('/skills').then(s => { if (s) setSkills(s); });
    if (userId) api(`/skills/offered/${userId}`).then(setOffered);
  };

  useEffect(() => { load(); }, [userId]);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const submit = async () => {
    if (!userId) return flash('Select an active user first.', 'error');
    if (!form.skillId) return flash('Select a skill.', 'error');

    const r = await api('/skills/offered', {
      method: 'POST',
      body: JSON.stringify({
        user: { id: parseInt(userId) },
        skill: { id: parseInt(form.skillId) },
        level: form.level,
      }),
    });
    if (r) { flash('Skill added!'); setForm({ skillId: '', level: 'BEGINNER' }); load(); }
    else flash('Error adding skill.', 'error');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Skills I Can Teach</div>
        <div className="page-subtitle">Add skills you can mentor others in</div>
      </div>

      {!userId && <Alert msg="Select an active user first." type="error" />}

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Add Offered Skill</div>
          <Alert msg={msg?.text} type={msg?.type} />
          <div className="form-group">
            <label className="label">Skill</label>
            <select
              className="select"
              value={form.skillId}
              onChange={e => setForm(p => ({ ...p, skillId: e.target.value }))}
            >
              <option value="">— Select a skill —</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Your Level</label>
            <select
              className="select"
              value={form.level}
              onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
            >
              <option>BEGINNER</option>
              <option>INTERMEDIATE</option>
              <option>ADVANCED</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={submit}>+ Add</button>
        </div>

        <div className="card">
          <div className="card-title">Your Offered Skills</div>
          {!offered ? <Loading /> : offered.length === 0 ? (
            <Empty icon="🎓" text="None added yet." />
          ) : (
            <div>
              {offered.map(o => (
                <div key={o.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '0.85rem' }}>{o.skill?.name}</span>
                  <span className="badge" style={{
                    background: `${LEVEL_COLORS[o.level]}22`,
                    color: LEVEL_COLORS[o.level],
                  }}>
                    {o.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
