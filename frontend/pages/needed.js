import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loading, Empty, Alert } from '../components/UI';

export default function NeededPage({ userId }) {
  const [skills, setSkills] = useState([]);
  const [needed, setNeeded] = useState(null);
  const [skillId, setSkillId] = useState('');
  const [msg, setMsg] = useState(null);

  const load = () => {
    api('/skills').then(s => { if (s) setSkills(s); });
    if (userId) api(`/skills/needed/${userId}`).then(setNeeded);
  };

  useEffect(() => { load(); }, [userId]);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const submit = async () => {
    if (!userId) return flash('Select an active user first.', 'error');
    if (!skillId) return flash('Select a skill.', 'error');

    const r = await api('/skills/needed', {
      method: 'POST',
      body: JSON.stringify({
        user: { id: parseInt(userId) },
        skill: { id: parseInt(skillId) },
      }),
    });
    if (r) { flash('Learning goal added!'); setSkillId(''); load(); }
    else flash('Error adding skill.', 'error');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Skills I Want to Learn</div>
        <div className="page-subtitle">Tell the platform what you want to master</div>
      </div>

      {!userId && <Alert msg="Select an active user first." type="error" />}

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Add Learning Goal</div>
          <Alert msg={msg?.text} type={msg?.type} />
          <div className="form-group">
            <label className="label">Skill</label>
            <select
              className="select"
              value={skillId}
              onChange={e => setSkillId(e.target.value)}
            >
              <option value="">— Select a skill —</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={submit}>+ Add Goal</button>
        </div>

        <div className="card">
          <div className="card-title">Your Learning Goals</div>
          {!needed ? <Loading /> : needed.length === 0 ? (
            <Empty icon="📚" text="No goals added yet." />
          ) : (
            <div className="pill-list">
              {needed.map(n => (
                <span key={n.id} className="pill">
                  <span className="dot dot-pink" />
                  {n.skill?.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
