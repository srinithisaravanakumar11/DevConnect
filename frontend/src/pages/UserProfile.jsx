import { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Mail, 
  Code, 
  Award, 
  MessageSquare, 
  HelpCircle, 
  Clock, 
  Edit3, 
  Check, 
  X
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { AVAILABLE_SKILLS } from '../context/constants';
import API from "../services/api";

export default function UserProfile() {
  const { username } = useParams();
  const { questions, currentUser, updateProfile } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSkills, setEditSkills] = useState([]);
  const [editExperienceLevel, setEditExperienceLevel] = useState('');

  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'answers'
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get(`/users/${username}`)
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, [username]);

  if (!user) {
    return (
      <div className="card empty-state">
        <h2>User profile not found</h2>
        <p>The developer account you are trying to view does not exist in our registry.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.username.toLowerCase() === user.username.toLowerCase();

  // Handle skills array mapping safely
  const userSkills = Array.isArray(user.skills) 
    ? user.skills 
    : (typeof user.skills === 'string' ? user.skills.split(',').filter(Boolean) : []);

  // Find user activity
  const userQuestions = questions.filter(q => q.author === user.username);
  
  // Find answers written by user
  const userAnswers = [];
  questions.forEach(q => {
    (q.answers || []).forEach(a => {
      if (a.author === user.username) {
        userAnswers.push({
          questionId: q.id,
          questionTitle: q.title,
          answerId: a.id,
          content: a.content,
          datePosted: a.datePosted,
          timestamp: a.timestamp,
          accepted: a.accepted
        });
      }
    });
  });

  // Calculate comments
  let commentCount = 0;
  questions.forEach(q => {
    (q.comments || []).forEach(c => {
      if (c.author === user.username) {
        commentCount++;
      }
    });
  });

  const handleStartEditing = () => {
    setEditBio(user.bio || '');
    setEditLocation(user.location || '');
    setEditSkills(userSkills);
    setEditExperienceLevel(user.experienceLevel || user.experience || 'Beginner');
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      bio: editBio,
      location: editLocation,
      skills: editSkills,
      experienceLevel: editExperienceLevel
    });
    setIsEditing(false);
  };

  const handleToggleSkill = (skill) => {
    if (editSkills.includes(skill)) {
      setEditSkills(prev => prev.filter(s => s !== skill));
    } else {
      setEditSkills(prev => [...prev, skill]);
    }
  };

  return (
    <div className="profile-grid">
      {/* Sidebar Details Column */}
      <div className="profile-sidebar">
        {/* Personal Details Card */}
        <div className="card profile-details-card">
          <div className="avatar avatar-lg" style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }}>
            {user.username[0].toUpperCase()}
          </div>
          
          <h2 className="profile-name">{user.username}</h2>
          <span className="profile-username">{user.experienceLevel || user.experience || 'Beginner'} Developer</span>
          
          {isEditing ? (
            <form onSubmit={handleSaveProfile} style={{ width: '100%', textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-location">Location</label>
                <input
                  id="edit-location"
                  type="text"
                  className="form-input"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-bio">Bio</label>
                <textarea
                  id="edit-bio"
                  className="form-input form-textarea"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  className="form-input"
                  value={editExperienceLevel}
                  onChange={(e) => setEditExperienceLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Skills</label>
                <div className="skills-select-grid" style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  {AVAILABLE_SKILLS.map(skill => {
                    const isSelected = editSkills.includes(skill);
                    return (
                      <span
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`badge badge-tag badge-tag-interactive ${isSelected ? 'badge-tag-active' : ''}`}
                        style={{ fontSize: '0.72rem', padding: '0.15rem 0.35rem' }}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={styles.editActionsRow}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancelEditing}>
                  <X size={14} /> Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Check size={14} /> Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="profile-bio">{user.bio || "This developer hasn't added a bio yet."}</p>
              
              <div className="profile-meta-list">
                <div className="profile-meta-item">
                  <MapPin size={16} />
                  <span>{user.location || 'Remote'}</span>
                </div>
                <div className="profile-meta-item">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="profile-meta-item">
                  <Calendar size={16} />
                  <span>Joined {user.joinedDate}</span>
                </div>
                <div className="profile-meta-item">
                  <Award size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                    {user.reputation} Reputation Points
                  </span>
                </div>
              </div>

              {isOwnProfile && (
                <button 
                  onClick={handleStartEditing} 
                  className="btn btn-secondary btn-sm" 
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Edit3 size={14} />
                  Edit Profile
                </button>
              )}
            </>
          )}
        </div>

        {/* Developer Skills Card */}
        {!isEditing && (
          <div className="card profile-activity-card">
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <Code size={18} style={{ color: 'var(--primary)' }} />
                Developer Stack
              </h3>
            </div>
            <div className="skills-container">
              {userSkills.length > 0 ? (
                userSkills.map(skill => (
                  <span key={skill} className="badge badge-tag" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No tags added yet.</p>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Main Activity Column */}
      <div>
        {/* Activity Insights Stats */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Activity Insights</h3>
          </div>
          <div className="activity-summary-grid">
            <div className="activity-stat-box">
              <span className="activity-stat-val">{userQuestions.length}</span>
              <span className="activity-stat-lbl">Questions Asked</span>
            </div>
            <div className="activity-stat-box">
              <span className="activity-stat-val">{userAnswers.length}</span>
              <span className="activity-stat-lbl">Answers Given</span>
            </div>
            <div className="activity-stat-box">
              <span className="activity-stat-val">{commentCount}</span>
              <span className="activity-stat-lbl">Comments Posted</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card with tabs */}
        <div className="card">
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              Recent Questions ({userQuestions.length})
            </button>
            <button
              className={`profile-tab ${activeTab === 'answers' ? 'active' : ''}`}
              onClick={() => setActiveTab('answers')}
            >
              Recent Answers ({userAnswers.length})
            </button>
          </div>

          {activeTab === 'questions' ? (
            <div className="profile-recent-list">
              {userQuestions.length > 0 ? (
                userQuestions.map(q => (
                  <div key={q.id} className="card recent-activity-card card-hover" style={styles.activityItemCard}>
                    <div style={styles.activityItemHeader}>
                      <span className="badge badge-tag">{q.category}</span>
                      <span className={`badge ${q.status === 'Solved' ? 'badge-solved' : 'badge-unsolved'}`} style={{ scale: '0.85' }}>
                        {q.status === 'Solved' ? 'Solved' : 'Open'}
                      </span>
                    </div>
                    <Link to={`/questions/${q.id}`} style={styles.activityItemTitle}>
                      {q.title}
                    </Link>
                    <div style={styles.activityItemMeta}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {q.datePosted}
                      </span>
                      <span>• {q.votes} upvotes</span>
                      <span>• {q.views} views</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noActivity}>
                  <HelpCircle size={32} />
                  <p>No questions posted by this user yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-recent-list">
              {userAnswers.length > 0 ? (
                userAnswers.map(ans => (
                  <div key={ans.answerId} className="card recent-activity-card card-hover" style={styles.activityItemCard}>
                    <div style={styles.activityItemHeader}>
                      <span style={styles.answerMetaTitle}>Answered on:</span>
                      {ans.accepted && (
                        <span className="badge badge-solved" style={{ scale: '0.8' }}>
                          ✓ Accepted
                        </span>
                      )}
                    </div>
                    <Link to={`/questions/${ans.questionId}`} style={styles.activityItemTitle}>
                      {ans.questionTitle}
                    </Link>
                    <p style={styles.answerSnippet}>
                      {ans.content.substring(0, 150)}
                      {ans.content.length > 150 ? '...' : ''}
                    </p>
                    <div style={styles.activityItemMeta}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {ans.datePosted}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noActivity}>
                  <MessageSquare size={32} />
                  <p>No answers submitted by this user yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  editActionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '0.75rem',
  },
  activityItemCard: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  activityItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityItemTitle: {
    fontWeight: 600,
    fontSize: '0.98rem',
    color: 'var(--text-heading)',
  },
  activityItemMeta: {
    display: 'flex',
    gap: '0.75rem',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    alignItems: 'center',
  },
  answerMetaTitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  answerSnippet: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    opacity: 0.85,
  },
  noActivity: {
    textAlign: 'center',
    padding: '2.5rem 1rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  }
};
