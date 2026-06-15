import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  HelpCircle, 
  MessageSquare, 
  Trophy, 
  ArrowRight,
  TrendingUp,
  Percent,
  Clock
} from 'lucide-react';
import { AppContext } from '../context/AppContext';


export default function Dashboard() {
  const { getDashboardStats } = useContext(AppContext);
  const stats = getDashboardStats();

  // Baseline mock offsets requested by user, merged with active mock questions in state
  const BASE_COUNTS = {
    'React': 320,
    'JavaScript': 280,
    'Python': 250,
    'SQL': 180,
    'Node.js': 120,
    'Java': 95,
    'Express.js': 64,
    'AI/ML': 48,
    'General': 32
  };

  const displayCategoryCounts = {};
  Object.keys(BASE_COUNTS).forEach(cat => {
    displayCategoryCounts[cat] = BASE_COUNTS[cat] + (stats.categoryCounts[cat] || 0);
  });

  // Sort categories by questions count to make the visual bar chart look highly professional
  const sortedCategories = Object.entries(displayCategoryCounts)
    .sort((a, b) => b[1] - a[1]);

  const maxCategoryCount = Math.max(...Object.values(displayCategoryCounts));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Community Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time analytics and activity overview of the DevConnect community.
          </p>
        </div>
        <Link to="/ask" className="btn btn-primary">
          <HelpCircle size={18} />
          Ask a Question
        </Link>
      </div>

      {/* Grid of Overview Cards */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-info">
            <h3>Total Members</h3>
            <span className="metric-value">{stats.totalMembers + 1420}</span> {/* base + active */}
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-info">
            <h3>Total Questions</h3>
            <span className="metric-value">{stats.totalQuestions + 1389}</span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
            <HelpCircle size={24} />
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-info">
            <h3>Total Answers</h3>
            <span className="metric-value">{stats.totalAnswers + 3280}</span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-info">
            <h3>Total Comments</h3>
            <span className="metric-value">{stats.totalComments + 5420}</span>
          </div>
          <div className="metric-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Problem Solving Insights & Grids */}
      <div className="insights-grid">
        <div className="insight-section">
          {/* Problem Solving Insights Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>
                <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
                Problem Solving Insights
              </h3>
            </div>
            
            <div style={styles.solutionStatsGrid}>
              <div style={styles.solutionStatBox}>
                <span style={{ ...styles.solutionStatVal, color: '#22c55e' }}>
                  {stats.solvedQuestions + 820}
                </span>
                <span style={styles.solutionStatLabel}>Solved Questions</span>
              </div>
              
              <div style={styles.solutionStatBox}>
                <span style={{ ...styles.solutionStatVal, color: '#f59e0b' }}>
                  {stats.unsolvedQuestions + 569}
                </span>
                <span style={styles.solutionStatLabel}>Unsolved Questions</span>
              </div>

              <div style={styles.solutionStatBox}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <span style={{ ...styles.solutionStatVal, color: 'var(--primary)' }}>
                    {/* recalculate with base offset */}
                    {Math.round(((stats.solvedQuestions + 820) / (stats.totalQuestions + 1389)) * 100)}
                  </span>
                  <Percent size={18} style={{ color: 'var(--primary)', fontWeight: 700 }} />
                </div>
                <span style={styles.solutionStatLabel}>Solution Rate</span>
              </div>
            </div>

            <div style={styles.progressTrackerWrapper}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>
                Resolution progress towards active community challenges
              </p>
              <div className="category-progress-bg" style={{ height: '10px' }}>
                <div 
                  className="category-progress-fill" 
                  style={{ 
                    width: `${Math.round(((stats.solvedQuestions + 820) / (stats.totalQuestions + 1389)) * 100)}%`,
                    backgroundColor: '#22c55e'
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Category Insights List */}
          <div className="card">
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Category Distribution</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sorted by frequency</span>
            </div>
            
            <div className="category-metric-list">
              {sortedCategories.map(([category, count]) => {
                const percentage = Math.round((count / maxCategoryCount) * 100);
                return (
                  <div className="category-metric-item" key={category}>
                    <div className="category-metric-header">
                      <span className="category-metric-name" style={{ fontWeight: 600 }}>{category}</span>
                      <span className="category-metric-count" style={{ fontWeight: 500 }}>
                        {count} {count === 1 ? 'Question' : 'Questions'}
                      </span>
                    </div>
                    <div className="category-progress-bg">
                      <div 
                        className="category-progress-fill" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Contributors Sidebar Section */}
        <div>
          <div className="card" style={{ height: '100%' }}>
            <div style={styles.cardHeader}>
              <h3 style={{ ...styles.cardTitle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} style={{ color: '#eab308' }} />
                Top Contributors
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Leaderboard ranked by answers & reputation points
            </p>

            <div className="leaderboard-list">
              {stats.contributors.map((user, idx) => (
                <div className="leader-item" key={user.username}>
                  <span className="leader-rank">#{idx + 1}</span>
                  <div className="leader-profile">
                    <div className="avatar" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {user.username[0].toUpperCase()}
                    </div>
                    <div className="leader-info">
                      <Link to={`/profile/${user.username}`} style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                        {user.username}
                      </Link>
                      <p>{user.experienceLevel} Developer</p>
                    </div>
                  </div>
                  <div className="leader-score">
                    <span className="score">{user.reputation}</span>
                    <p className="label">{user.answersCount || 0} answers</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link to="/questions" style={styles.viewFeedLink}>
                Explore Active Questions
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  solutionStatsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    textAlign: 'center',
    margin: '1.5rem 0',
  },
  solutionStatBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  solutionStatVal: {
    fontSize: '1.75rem',
    fontWeight: 800,
    lineHeight: 1.1,
  },
  solutionStatLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.25rem',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  progressTrackerWrapper: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border-color)',
  },
  viewFeedLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--primary)',
    transition: 'gap var(--transition-fast)',
  },
};
