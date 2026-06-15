import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  MessageSquare, 
  CheckCircle2, 
  MessageCircle, 
  ThumbsUp,
  Check, 
  Trash2,
  Inbox,
  Clock
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Notifications() {
  const { 
    notifications, 
    markNotificationsAsRead, 
    deleteNotification 
  } = useContext(AppContext);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = () => {
    markNotificationsAsRead();
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'answer':
      case 'new_answer':
        return <MessageSquare size={16} />;
      case 'question_upvote':
      return <ThumbsUp size={16} />;
      case 'accepted':
      case 'accepted_answer':
        return <CheckCircle2 size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getIconClass = (type) => {
    switch (type) {
      case 'answer':
      case 'new_answer':
        return 'answer';
      case 'question_upvote':
        return 'upvote';
      case 'accepted':
      case 'accepted_answer':
        return 'accepted';
      default:
        return 'system';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div className="notifications-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.` 
              : 'You are all caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleMarkAllRead}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <Check size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.notification_id} 
              className={`card notification-card ${notif.is_read ? '' : 'unread'}`}
            >
              {/* Left Action Icon indicator */}
              <div className={`notification-icon-wrapper ${getIconClass(notif.notification_type)}`}>
                {getIconForType(notif.notification_type)}
              </div>

              {/* Central Text description */}
              <div className="notification-content">
                <Link 
                  to={notif.question_id ? `/questions/${notif.question_id}` : '#'} 
                  className="notification-msg"
                  style={styles.notifLink}
                >
                  {notif.message}
                </Link>
                <div className="notification-time" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} />
                  <span>{formatDistanceToNow(new Date(notif.created_at),{ addSuffix: true })}</span>
                </div>
              </div>

              {/* Unread indicator dot */}
              {!notif.is_read && <div className="notification-dot" title="Unread notification" />}

              {/* Delete button */}
              <button 
                onClick={() => {if (window.confirm("Are you sure you want to delete this notification?"))
                  {deleteNotification(notif.notification_id);}}}
                style={styles.deleteBtn}
                title="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="card empty-state" style={{ padding: '4rem 2rem' }}>
            <Inbox size={48} style={{ color: 'var(--text-muted)' }} />
            <h3>Your inbox is empty</h3>
            <p>We'll notify you here when someone answers your questions, comments on your posts, or accepts your solutions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  notifLink: {
    textDecoration: 'none',
    transition: 'color var(--transition-fast)',
  },
  deleteBtn: {
    color: 'var(--text-muted)',
    opacity: 0.6,
    padding: '6px',
    borderRadius: '4px',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .notification-card:hover .notification-msg {
      color: var(--primary) !important;
    }
    .notification-card button[style*="deleteBtn"]:hover {
      background-color: rgba(239, 68, 68, 0.1) !important;
      color: #ef4444 !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);
}
