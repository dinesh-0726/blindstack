import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loading, Empty, Alert, Avatar, Badge } from '../components/UI';

const LEVEL_COLORS = {
  BEGINNER:     'var(--accent)',
  INTERMEDIATE: 'var(--accent3)',
  ADVANCED:     'var(--accent2)',
};

export default function MatchPage({ userId }) {
  const [mentors, setMentors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState({});
  const [msg, setMsg] = useState(null);

  const findMentors = async () => {
    if (!userId) return;
    setLoading(true);
    const r = await api(`/match/${userId}`);
    setMentors(r || []);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) findMentors();
    else setMentors(null);
  }, [userId]);

  const sendRequest = async (mentorId, skillId) => {
    const key = `${mentorId}-${skillId}`;
    const r = await api('/requests', {
      method: 'POST',
      body: JSON.stringify({
        learner: { id: parseInt(userId) },
        mentor: { id: mentorId },
        skill: { id: skillId },
        status: 'PENDING',
      }),
    });
    if (r) {
      setSendStatus(p => ({ ...p, [key]: 'sent' }));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Find Mentors</div>
        <div className="page-subtitle">Matched to your learning goals automatically</div>
      </div>

      {!userId ? (
        <Alert msg="Select an active user to find mentor matches." type="error" />
      ) : loading ? (
        <Loading />
      ) : !mentors ? (
        <button className="btn btn-primary" onClick={findMentors}>🔍 Find My Matches</button>
      ) : mentors.length === 0 ? (
        <>
          <button className="btn btn-outline" onClick={findMentors} style={{ marginBottom: 20 }}>↺ Refresh</button>
          <Empty
            icon="🔍"
            text="No mentor matches found. Make sure you've added skills you need, and others have added skills they teach."
          />
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              Found <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{mentors.length}</span> mentor match{mentors.length !== 1 ? 'es' : ''}
            </span>
            <button className="btn btn-outline btn-sm" onClick={findMentors}>↺ Refresh</button>
          </div>

          {mentors.map((m, i) => {
            const key = `${m.mentor?.id}-${m.skill?.id}`;
            const sent = sendStatus[key] === 'sent';
            const levelColor = LEVEL_COLORS[m.level] || 'var(--accent)';

            return (
              <div key={i} className="mentor-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <Avatar
                      name={m.mentor?.name}
                      gradient="linear-gradient(135deg,#6366f1,#f472b6)"
                      size={48}
                      textColor="#fff"
                    />
                    <div>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: 3 }}>
                        {m.mentor?.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 10 }}>
                        {m.mentor?.email}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span className="badge badge-pink">{m.skill?.name}</span>
                        {m.level && (
                          <span className="badge" style={{
                            background: `${levelColor}22`,
                            color: levelColor,
                          }}>
                            {m.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`btn btn-sm ${sent ? 'btn-outline' : 'btn-primary'}`}
                    onClick={() => !sent && sendRequest(m.mentor?.id, m.skill?.id)}
                    disabled={sent}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {sent ? '✓ Requested' : 'Send Request'}
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
