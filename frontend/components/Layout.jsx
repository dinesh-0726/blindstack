import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const NAV = [
  { href: '/',         icon: '◈', label: 'Dashboard'      },
  { href: '/users',    icon: '◉', label: 'Users'           },
  { href: '/skills',   icon: '◆', label: 'Skills Library'  },
  { href: '/offered',  icon: '▲', label: 'Skills I Teach'  },
  { href: '/needed',   icon: '▼', label: 'Skills I Learn'  },
  { href: '/match',    icon: '◎', label: 'Find Mentors'    },
  { href: '/requests', icon: '◷', label: 'Requests'        },
];

export default function Layout({ children }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    api('/users').then(u => { if (u) setUsers(u); });
    const saved = localStorage.getItem('skillsphere_userId');
    if (saved) setUserId(saved);
  }, []);

  const handleUserChange = (e) => {
    setUserId(e.target.value);
    localStorage.setItem('skillsphere_userId', e.target.value);
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Skill<span>Sphere</span></div>
        <nav className="nav">
          {NAV.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${router.pathname === href ? ' active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          API: localhost:8080<br />
          <span style={{ color: '#065f46' }}>●</span> Spring Boot + SQLite
        </div>
      </aside>

      {/* User selector bar */}
      <div className="user-bar">
        <span className="user-bar-label">ACTIVE USER</span>
        <select
          className="select"
          style={{ width: 220, padding: '6px 12px', fontSize: '0.77rem' }}
          value={userId}
          onChange={handleUserChange}
        >
          <option value="">— Select user —</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} (#{u.id})</option>
          ))}
        </select>
        {userId && <span className="badge badge-green">Active</span>}
      </div>

      {/* Main content — pass userId via cloneElement */}
      <main className="main-content">
        {typeof children === 'function'
          ? children({ userId, users })
          : children}
      </main>
    </div>
  );
}
