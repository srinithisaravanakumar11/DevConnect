import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    }
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="app-container">
      <Navbar toggleMobileSidebar={toggleSidebar} />
      
      <div className="main-wrapper">
        {/* Desktop Sidebar */}
        {desktopSidebarOpen && (
          <div className="desktop-sidebar-wrapper">
            <Sidebar closeMobileSidebar={closeMobileSidebar} />
          </div>
        )}

        {/* Mobile Sidebar overlay/drawer */}
        {mobileSidebarOpen && (
          <div 
            style={styles.overlay} 
            onClick={closeMobileSidebar} 
            className="mobile-overlay"
          />
        )}
        
        <div 
          style={{
            ...styles.mobileSidebarContainer,
            transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
          className="mobile-sidebar-drawer"
        >
          <div style={styles.mobileSidebarHeader}>
            <span style={styles.mobileLogoText}>DevConnect Menu</span>
            <button onClick={closeMobileSidebar} style={styles.closeBtn}>×</button>
          </div>
          <Sidebar closeMobileSidebar={closeMobileSidebar} />
        </div>

        {/* Main content page area */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 95,
  },
  mobileSidebarContainer: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--bg-sidebar)',
    zIndex: 100,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileSidebarHeader: {
    height: 'var(--navbar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'var(--bg-sidebar)',
    color: '#ffffff',
  },
  mobileLogoText: {
    fontWeight: 700,
    fontSize: '1rem',
  },
  closeBtn: {
    fontSize: '2rem',
    color: '#ffffff',
    lineHeight: 1,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Desktop layout defaults */
    .desktop-sidebar-wrapper {
      display: block;
      width: var(--sidebar-width);
      flex-shrink: 0;
    }
    .mobile-sidebar-drawer {
      display: none !important;
    }
    .main-content {
      margin-left: 0px; /* Layout handles columns via flexbox */
    }

    /* Mobile media queries */
    @media (max-width: 768px) {
      .desktop-sidebar-wrapper {
        display: none !important;
      }
      .mobile-sidebar-drawer {
        display: flex !important;
      }
      /* Sidebar fixed overlay positions */
      .mobile-sidebar-drawer .sidebar-container {
        position: relative !important;
        top: 0 !important;
        height: 100% !important;
        flex: 1 !important;
        box-shadow: none !important;
      }
      .main-content {
        padding: 1rem !important;
      }
    }
  `;
  document.head.appendChild(style);
}
