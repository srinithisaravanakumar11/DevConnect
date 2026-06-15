import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, KeyRound, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-card card" style={styles.authCardOverrides}>
        <div className="auth-header">
          <div className="logo-group">
            <div style={styles.logoIcon}>
              <Terminal size={22} />
            </div>
            <span className="logo-text">DevConnect</span>
          </div>
          <p style={{ marginTop: '0.25rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            Ask. Learn. Share. Grow.
          </p>
          <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', fontWeight: 700 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Enter your credentials to access your developer dashboard
          </p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={styles.inputIconWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="e.g. john@devconnect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
            <p style={styles.hintText}>Hint: Any email from mock users works (e.g., john@devconnect.com)</p>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={styles.inputIconWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem' }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authCardOverrides: {
    maxWidth: '450px',
    boxShadow: 'var(--shadow-lg)',
  },
  logoIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
  },
  inputIconWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  inputWithIcon: {
    paddingLeft: '2.75rem',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
  },
  hintText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.35rem',
    fontStyle: 'italic',
  }
};
