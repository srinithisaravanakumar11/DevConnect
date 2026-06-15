import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User, Menu, Terminal, ChevronDown } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Navbar({ toggleMobileSidebar }) {
  const { currentUser, logout, notifications, searchQuery, setSearchQuery } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If we're not already on the questions feed page, redirect there to display search results.
    if (window.location.pathname !== '/questions') {
      navigate('/questions');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar" style={styles.navbar}>
      <div style={styles.navLeft}>
        <button className="mobile-menu-btn" onClick={toggleMobileSidebar} style={styles.mobileMenuBtn}>
          <Menu size={22} />
        </button>
        <Link to="/" style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <Terminal size={18} />
          </div>
          <span style={styles.logoText}>DevConnect</span>
        </Link>
      </div>

      <div style={styles.navCenter}>
        <div className="search-input-wrapper" style={{ width: '100%', maxWidth: '500px' }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search questions by title or category..."
            className="form-input search-field"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ borderRadius: 'var(--radius-full)', paddingVertical: '0.5rem' }}
          />
        </div>
      </div>

      <div style={styles.navRight}>
        <Link to="/notifications" style={styles.notifLink} aria-label="Notifications">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="pulse-badge" style={styles.badge}>
              {unreadCount}
            </span>
          )}
        </Link>

        {currentUser && (
          <div style={styles.profileDropdown} ref={dropdownRef}>
            <button style={styles.avatarBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="avatar avatar-sm">
                {currentUser.username[0].toUpperCase()}
              </div>
              <span style={styles.usernameText}>{currentUser.username}</span>
              <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </button>

            {dropdownOpen && (
              <div style={styles.dropdownMenu} className="card">
                <div style={styles.dropdownHeader}>
                  <p style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{currentUser.username}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</p>
                </div>
                <div style={styles.dropdownDivider} />
                <Link
                  to={`/profile/${currentUser.username}`}
                  style={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={16} />
                  My Profile
                </Link>
                <button
                  style={{ ...styles.dropdownItem, ...styles.logoutItem }}
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--navbar-height)',
    backgroundColor: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    zIndex: 100,
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  mobileMenuBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    transition: 'background-color var(--transition-fast)',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-heading)',
    letterSpacing: '-0.02em',
  },
  navCenter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 2rem',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  notifLink: {
    position: 'relative',
    color: 'var(--text-muted)',
    padding: '6px',
    borderRadius: 'var(--radius-full)',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: 700,
    minWidth: '16px',
    height: '16px',
    borderRadius: 'var(--radius-full)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    border: '2px solid var(--bg-card)',
  },
  profileDropdown: {
    position: 'relative',
  },
  avatarBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '4px 8px',
    borderRadius: 'var(--radius-full)',
    transition: 'background-color var(--transition-fast)',
  },
  usernameText: {
    fontWeight: 500,
    fontSize: '0.875rem',
    color: 'var(--text-main)',
    display: 'inline', // responsive hiding is handled via CSS
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: '200px',
    padding: '0.5rem 0',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 110,
  },
  dropdownHeader: {
    padding: '0.75rem 1rem',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '0.25rem 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 1rem',
    fontSize: '0.875rem',
    color: 'var(--text-main)',
    transition: 'all var(--transition-fast)',
    textAlign: 'left',
    width: '100%',
  },
  logoutItem: {
    color: '#ef4444',
  },
};
// Add custom responsive rules dynamically via DOM style injection or stylesheet
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .navbar span { display: none !important; }
      .navbar .search-input-wrapper { display: none !important; }
      .navbar { padding: 0 1rem !important; }
    }
    .mobile-menu-btn:hover {
      background-color: var(--bg-main) !important;
      color: var(--text-heading) !important;
    }
    .dropdownItem:hover {
      background-color: var(--bg-main);
      color: var(--text-heading);
    }
  `;
  document.head.appendChild(style);
}
