import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, User, Mail, KeyRound, MapPin, AlignLeft, AlertCircle, Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { AVAILABLE_SKILLS } from '../context/constants';

export default function Register() {
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState('Beginner'); // default

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(AppContext);

  const handleToggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSkills(prev => [...prev, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !email || !password) {
      setError('Username, Email and Password are required.');
      setLoading(false);
      return;
    }

    try {
      await register({
        username,
        email,
        password,
        bio,
        location,
        skills,
        experienceLevel
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
      <div className="auth-card card" style={styles.authCardOverrides}>
        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <div className="logo-group">
            <div style={styles.logoIcon}>
              <Terminal size={22} />
            </div>
            <span className="logo-text">DevConnect</span>
          </div>
          <p style={{ marginTop: '0.25rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            Ask. Learn. Share. Grow.
          </p>
          <h2 style={{ fontSize: '1.25rem', marginTop: '1.25rem', fontWeight: 700 }}>
            Create your account
          </h2>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Join a global community of developers solving real-world challenges
          </p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Personal Details */}
          <div style={styles.formSectionHeader}>
            <User size={16} style={{ color: 'var(--primary)' }} />
            <span>Personal Details</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={styles.inputIconWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="e.g. dev_dan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={styles.inputIconWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="e.g. dan@devconnect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={styles.inputIconWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputWithIcon}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">Location</label>
            <div style={styles.inputIconWrapper}>
              <MapPin size={18} style={styles.inputIcon} />
              <input
                id="location"
                type="text"
                className="form-input"
                placeholder="e.g. Austin, TX (or Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={styles.inputWithIcon}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">Bio</label>
            <div style={styles.inputIconWrapper}>
              <AlignLeft size={18} style={{ ...styles.inputIcon, top: '1.25rem', transform: 'none' }} />
              <textarea
                id="bio"
                className="form-input form-textarea"
                placeholder="Briefly describe what you build..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ ...styles.inputWithIcon, minHeight: '80px' }}
              />
            </div>
          </div>

          {/* Section 2: Developer Details */}
          <div style={styles.formSectionHeader}>
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            <span>Developer Details</span>
          </div>

          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <div className="experience-select-group">
              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <div
                  key={lvl}
                  className={`experience-card ${experienceLevel === lvl ? 'active' : ''}`}
                  onClick={() => setExperienceLevel(lvl)}
                >
                  {lvl}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Select Skills (Tags)</label>
            <div className="skills-select-grid">
              {AVAILABLE_SKILLS.map(skill => {
                const isSelected = skills.includes(skill);
                return (
                  <span
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`badge badge-tag badge-tag-interactive ${isSelected ? 'badge-tag-active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    {isSelected ? '✓ ' : ''}{skill}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authCardOverrides: {
    maxWidth: '520px',
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
  formSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
    marginTop: '1.75rem',
    marginBottom: '1rem',
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
};
