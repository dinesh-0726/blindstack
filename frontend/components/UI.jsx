// Shared reusable UI components

export function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <span>Loading...</span>
    </div>
  );
}

export function Alert({ msg, type = 'success' }) {
  if (!msg) return null;
  return <div className={`alert alert-${type}`}>{msg}</div>;
}

export function Empty({ icon = '📭', text = 'Nothing here yet.' }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <p>{text}</p>
    </div>
  );
}

export function Avatar({ name, gradient = 'linear-gradient(135deg,#6ee7b7,#f472b6)', size = 44, textColor = '#0a0a0f' }) {
  return (
    <div
      className="avatar"
      style={{
        width: size, height: size,
        background: gradient,
        color: textColor,
        fontSize: size * 0.4,
      }}
    >
      {(name || '?')[0].toUpperCase()}
    </div>
  );
}

export function Badge({ children, variant = 'gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
