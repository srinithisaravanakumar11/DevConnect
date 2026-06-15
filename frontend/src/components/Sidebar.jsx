import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HelpCircle, 
  PlusCircle, 
  User, 
  Bell,
  Code
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Sidebar({ closeMobileSidebar }) {
  const { currentUser, notifications } = useContext(AppContext);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Questions', path: '/', icon: HelpCircle },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Ask Question', path: '/ask', icon: PlusCircle },
    { name: 'Profile', path: currentUser ? `/profile/${currentUser.username}` : '#', icon: User },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <aside style={styles.sidebar} className="sidebar-container">
      <nav style={styles.navGroup}>
        {navItems.map(item => {
          if (item.path === '#' && !currentUser) return null;
          
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMobileSidebar}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                color: isActive ? 'var(--text-sidebar-active)' : 'var(--text-sidebar)',
                fontWeight: isActive ? 600 : 500
              })}
              className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={styles.badge}>{item.badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {currentUser && (
        <div style={styles.userCard}>
          <div style={styles.userCardContent}>
            <div className="avatar avatar-sm" style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}>
              {currentUser.username[0].toUpperCase()}
            </div>
            <div style={styles.userInfo}>
              <p style={styles.userName}>{currentUser.username}</p>
              <div style={styles.userRep}>
                <Code size={12} style={{ color: 'var(--primary)' }} />
                <span>{currentUser.reputation} reputation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.5rem 1rem',
    position: 'sticky',
    top: 'var(--navbar-height)',
    height: 'calc(100vh - var(--navbar-height))',
    zIndex: 90,
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0.15rem 0.5rem',
    borderRadius: 'var(--radius-full)',
  },
  userCard: {
    padding: '0.75rem',
    backgroundColor: 'var(--bg-sidebar-hover)',
    borderRadius: 'var(--radius-lg)',
    marginTop: 'auto',
  },
  userCardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRep: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: 'var(--text-sidebar)',
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .sidebar-link:hover {
      background-color: var(--bg-sidebar-hover) !important;
      color: var(--text-sidebar-active) !important;
    }
  `;
  document.head.appendChild(style);
}
