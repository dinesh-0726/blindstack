import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loading, Empty, Avatar, Alert } from '../components/UI';

export default function Dashboard({ userId, users }) {
  const [offered, setOffered] = useState(null);
  const [needed, setNeeded] = useState(null);

  const user = users?.find(u => u.id === parseInt(userId));

  useEffect(() => {
    if (!userId) return;
    setOffered(null);
    setNeeded(null);
    api(`/skills/offered/${userId}`).then(setOffered);
    api(`/skills/needed/${userId}`).then(setNeeded);
  }, [userId]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-subtitle">Your learning & mentoring overview</div>
      </div>

      {!userId && (
        <Alert msg="Select an active user from the top bar to view your dashboard." type="error" />
      )}

      {user && (
        <>
          {/* Profile card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <Avatar name={user.name} gradient="linear-gradient(135deg,#6ee7b7,#f472b6)" size={56} />
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.15rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{user.email}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <div className="stat">
              <div className="stat-num">{offered ? offered.length : '—'}</div>
              <div className="stat-label">Skills Teaching</div>
            </div>
            <div className="stat">
              <div className="stat-num" style={{ color: 'var(--accent2)' }}>{needed ? needed.length : '—'}</div>
              <div className="stat-label">Skills Learning</div>
            </div>
            <div className="stat">
              <div className="stat-num" style={{ color: 'var(--accent3)' }}>
                {offered && needed ? offered.length + needed.length : '—'}
              </div>
              <div className="stat-label">Total Connections</div>
            </div>
          </div>

          {/* Skills columns */}
          <div className="grid-2">
            <div className="card">
              <div className="card-title">Skills I Teach</div>
              {!offered ? <Loading /> : offered.length === 0 ? (
                <Empty icon="🎓" text="No skills offered yet. Go add some!" />
              ) : (
                <div className="pill-list">
                  {offered.map(o => {
                    const lc = { BEGINNER: 'var(--accent)', INTERMEDIATE: 'var(--accent3)', ADVANCED: 'var(--accent2)' };
                    return (
                      <span key={o.id} className="pill">
                        <span className="dot" style={{ background: lc[o.level] || 'var(--accent)' }} />
                        {o.skill?.name}
                        <span style={{ opacity: 0.5, fontSize: '0.65rem' }}>{o.level}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="card">
              <div className="card-title">Skills I'm Learning</div>
              {!needed ? <Loading /> : needed.length === 0 ? (
                <Empty icon="📚" text="No learning goals yet. Add some!" />
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
        </>
      )}
    </div>
  );
}
