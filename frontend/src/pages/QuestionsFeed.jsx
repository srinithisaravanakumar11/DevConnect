import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronUp, 
  Eye, 
  Clock, 
  User, 
  Tag, 
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { CATEGORIES } from '../context/constants';


export default function QuestionsFeed() {
  const { questions, searchQuery, setSearchQuery, voteQuestion, currentUser } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'popular' | 'unsolved'

  const categories = ['All', ...CATEGORIES];

  // Filter logic
  const filteredQuestions = questions.filter(q => {
    const matchesCategory = selectedCategory === 'All' || q.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sorting logic
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.votes - a.votes;
    }
    if (sortBy === 'unsolved') {
      // Unsolved first
      if (a.status === 'Unsolved' && b.status === 'Solved') return -1;
      if (a.status === 'Solved' && b.status === 'Unsolved') return 1;
      return b.timestamp - a.timestamp;
    }
    // Default 'recent'
    return b.timestamp - a.timestamp;
  });

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Developer Forums</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Search discussions, ask troubleshooting questions, and collaborate.
          </p>
        </div>
        <Link to="/ask" className="btn btn-primary">
          <PlusCircle size={18} />
          Ask a Question
        </Link>
      </div>

      {/* Search & Sorting Toolbar */}
      <div className="card" style={styles.toolbarCard}>
        <div className="search-filter-row">
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search forums by keyword, topic, or description..."
              className="form-input search-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={styles.sortWrapper}>
            <label style={styles.sortLabel} htmlFor="sort-select">Sort By:</label>
            <select
              id="sort-select"
              className="form-input form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="recent">Newest Activity</option>
              <option value="popular">Most Upvotes</option>
              <option value="unsolved">Unsolved First</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal scroll tabs */}
        <div style={{ marginTop: '1.25rem' }}>
          <p style={styles.tabHeading}>Filter by Category:</p>
          <div className="filter-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map(q => {
            const hasUpvoted = currentUser && q.upvotedBy.includes(currentUser.username);
            return (
              <article className="card question-card card-hover" key={q.id}>
                {/* Voting Container */}
                <div className="question-votes">
                  <button 
                    onClick={() => voteQuestion(q.id)} 
                    className={`vote-btn ${hasUpvoted ? 'upvoted' : ''}`}
                    title="Upvote this question"
                    style={styles.voteBtnOverrides}
                  >
                    <ChevronUp size={24} strokeWidth={3} />
                  </button>
                  <span className="vote-count">{q.votes}</span>
                </div>

                {/* Main Card Content */}
                <div className="question-body">
                  <div style={styles.titleRow}>
                    <Link to={`/questions/${q.id}`} className="question-title">
                      {q.title}
                    </Link>
                    
                    {/* Status Badge */}
                    <span className={`badge ${q.status === 'Solved' ? 'badge-solved' : 'badge-unsolved'}`}>
                      {q.status === 'Solved' ? '✓ Solved' : '● Open'}
                    </span>
                  </div>

                  {/* Summary/Snippet */}
                  <p style={styles.snippet}>
                    {q.description.substring(0, 180)}
                    {q.description.length > 180 ? '...' : ''}
                  </p>

                  {/* Metadata Row */}
                  <div className="question-meta" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <span className="badge badge-tag">
                      <Tag size={12} />
                      {q.category}
                    </span>
                    <span className="meta-item">
                      <User size={14} />
                      by <Link to={`/profile/${q.author}`} style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{q.author}</Link>
                    </span>
                    <span className="meta-item">
                      <Clock size={14} />
                      {q.datePosted}
                    </span>
                    <span className="meta-item">
                      <Eye size={14} />
                      {q.views} views
                    </span>
                  </div>
                </div>

                {/* Answers Count side box */}
                <div className="question-stats-side">
                  <div className="stat-box" style={styles.statBoxOverrides}>
                    <span className="stat-num">{q.answers.length}</span>
                    <span className="stat-lbl">answers</span>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="card empty-state">
            <HelpCircle size={48} />
            <h3>No questions found</h3>
            <p>We couldn't find any questions matching your filters. Try clearing your search or choosing a different category.</p>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              style={{ marginTop: '1rem' }}
            >
              Reset Filters
            </button>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  toolbarCard: {
    padding: '1.25rem',
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: '220px',
  },
  sortLabel: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
  },
  sortSelect: {
    padding: '0.5rem 2.25rem 0.5rem 0.75rem',
    fontSize: '0.85rem',
  },
  tabHeading: {
    fontSize: '0.78rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  snippet: {
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    lineHeight: 1.4,
    opacity: 0.85,
  },
  voteBtnOverrides: {
    padding: '4px',
    borderRadius: '4px',
  },
  statBoxOverrides: {
    backgroundColor: 'var(--bg-main)',
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    minWidth: '70px',
  }
};
