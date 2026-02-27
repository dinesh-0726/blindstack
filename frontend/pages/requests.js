import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Loading, Empty, Alert } from '../components/UI';

const STATUS_BADGE = {
  PENDING:  'badge-yellow',
  ACCEPTED: 'badge-green',
  REJECTED: 'badge-red',
};

export default function RequestsPage({ userId }) {
  const [requests, setRequests] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = () => {
    if (userId) api(`/requests/${userId}`).then(setRequests);
  };

  useEffect(() => { load(); }, [userId]);

  const updateStatus = async (id, status) => {
    const r = await api(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    if (r) load();
    else setMsg({ text: 'Error updating request.', type: 'error' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Requests</div>
        <div className="page-subtitle">Manage incoming and outgoing learning requests</div>
      </div>

      {!userId ? (
        <Alert msg="Select an active user to see your requests." type="error" />
      ) : (
        <>
          <Alert msg={msg?.text} type={msg?.type} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-outline btn-sm" onClick={load}>↺ Refresh</button>
          </div>

          {!requests ? <Loading /> : requests.length === 0 ? (
            <Empty icon="📨" text="No requests yet. Find a mentor and send a request!" />
          ) : (
            requests.map(r => (
              <div key={r.id} className="request-card">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.learner?.name}</span>
                    <span style={{ color: 'var(--muted)', margin: '0 8px' }}>→</span>
                    <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{r.mentor?.name}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                    Skill: <span style={{ color: 'var(--text)' }}>{r.skill?.name}</span>
                    <span style={{ margin: '0 8px' }}>·</span>
                    ID #{r.id}
                  </div>
                </div>

                <span className={`badge ${STATUS_BADGE[r.status] || 'badge-gray'}`}>
                  {r.status}
                </span>

                {/* Mentor sees accept/reject for PENDING requests */}
                {r.status === 'PENDING' && r.mentor?.id === parseInt(userId) && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateStatus(r.id, 'ACCEPTED')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateStatus(r.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
