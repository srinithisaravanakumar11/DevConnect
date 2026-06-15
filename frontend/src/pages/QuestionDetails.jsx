import { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronUp, 
  MessageSquare, 
  Eye, 
  Clock, 
  User, 
  Tag, 
  Check, 
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import API from '../services/api';

export default function QuestionDetails() {
  const { id } = useParams();
  const { 
    questions, 
    currentUser, 
    voteQuestion, 
    addAnswer, 
    acceptAnswer, 
  } = useContext(AppContext);


  const [newAnswerText, setNewAnswerText] = useState('');
  const question = questions.find(q => String(q.id) === String(id));
  
  useEffect(() => {
    if (!id) return;
    const viewedKey = `viewed-${id}`;
    if (!localStorage.getItem(viewedKey)) {
      API.post(`/questions/${id.replace('q', '')}/view`)
        .catch(err => console.error(err));

      localStorage.setItem(viewedKey, "true");
    }
  }, [id]);

  if (!question) {
    return (
      <div className="card empty-state">
        <h2>Question not found</h2>
        <p>The question you are looking for might have been deleted or the link is invalid.</p>
        <Link to="/questions" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Forums
        </Link>
      </div>
    );
  }

  const isAuthor = currentUser && question.author === currentUser.username;
  const hasUpvoted = currentUser && question.upvotedBy.includes(currentUser.username);

  // Submit Answer
  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!newAnswerText.trim()) return;
    addAnswer(question.id, newAnswerText);
    setNewAnswerText('');
  };

  return (
    <div style={styles.container}>
      {/* Back button */}
      <div>
        <Link to="/questions" style={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Forums
        </Link>
      </div>

      {/* Main Question Thread Card */}
      <article className="card question-detail-card">
        {/* Voting Panel */}
        <div className="question-votes" style={{ alignSelf: 'flex-start' }}>
          <button 
            onClick={() => voteQuestion(question.id)} 
            className={`vote-btn ${hasUpvoted ? 'upvoted' : ''}`}
            style={styles.voteBtnOverrides}
          >
            <ChevronUp size={24} strokeWidth={3} />
          </button>
          <span className="vote-count">{question.votes}</span>
        </div>

        {/* Content Panel */}
        <div className="question-detail-content">
          <div style={styles.titleBadgeRow}>
            <span className={`badge ${question.status === 'Solved' ? 'badge-solved' : 'badge-unsolved'}`}>
              {question.status === 'Solved' ? '✓ Solved' : '● Open'}
            </span>
            <span className="badge badge-tag">
              <Tag size={12} />
              {question.category}
            </span>
          </div>

          <h2 style={styles.questionTitle}>{question.title}</h2>

          {/* Metadata */}
          <div className="question-meta" style={styles.metaRow}>
            <span className="meta-item">
              <User size={14} />
              Asked by <Link to={`/profile/${question.author}`} style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{question.author}</Link>
            </span>
            <span className="meta-item">
              <Clock size={14} />
              {question.datePosted}
            </span>
            <span className="meta-item">
              <Eye size={14} />
              {question.views} views
            </span>
          </div>

          <div style={styles.divider} />

          {/* Description Block with code formatted rendering */}
          <div className="question-desc" style={styles.descFormatting}>
            {question.description}
          </div>
        </div>
      </article>

      {/* Answers Section */}
      <div className="answers-section-header">
        <h3>{question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}</h3>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Answers with green borders are verified by authors
        </span>
      </div>

      <div className="answers-list">
        {question.answers.length > 0 ? (
          question.answers.map(ans => {
            return (
              <div 
                key={ans.id} 
                className={`card answer-card ${ans.accepted ? 'accepted' : ''}`}
              >
                <div className="answer-layout">
                  <div className="answer-body">
                    {/* Answer Header Info */}
                    <div className="answer-header">
                      <div className="author-info">
                        <div className="avatar avatar-sm">
                          {ans.author[0].toUpperCase()}
                        </div>
                        <Link to={`/profile/${ans.author}`} style={styles.authorNameLink}>
                          {ans.author}
                        </Link>
                        <span style={styles.authorMetaBadge}>Contributor</span>
                        <span className="post-time">• {ans.datePosted}</span>
                      </div>

                      {/* Accept Answer Control */}
                      {ans.accepted ? (
                        <span className="badge badge-solved" style={styles.acceptedLabel}>
                          <ShieldCheck size={14} />
                          ✓ Accepted Answer
                        </span>
                      ) : (
                        isAuthor && (
                          <button
                            onClick={() => acceptAnswer(question.id, ans.id)}
                            style={styles.acceptBtn}
                            className="btn btn-secondary btn-sm"
                            title="Accept this answer as the correct solution"
                          >
                            <Check size={14} />
                            Accept Solution
                          </button>
                        )
                      )}
                    </div>

                    {/* Answer text */}
                    <div className="answer-text" style={styles.descFormatting}>
                      {ans.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card empty-state" style={{ padding: '2rem' }}>
            <MessageSquare size={36} style={{ color: 'var(--text-muted)' }} />
            <h4 style={{ color: 'var(--text-heading)', marginTop: '0.5rem' }}>No answers yet</h4>
            <p style={{ fontSize: '0.875rem' }}>Be the first to share your expert solution!</p>
          </div>
        )}
      </div>

      {/* Add Answer Form (Reddit / Stack Overflow style editor card) */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>Your Answer</h3>
        <form onSubmit={handleAnswerSubmit}>
          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              placeholder="Provide a detailed, step-by-step code solution. Markdown code blocks are supported..."
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              required
              style={styles.answerTextarea}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              Post Your Answer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  titleBadgeRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  questionTitle: {
    fontSize: '1.65rem',
    fontWeight: 800,
    lineHeight: 1.3,
    color: 'var(--text-heading)',
    letterSpacing: '-0.01em',
    marginTop: '0.5rem',
  },
  metaRow: {
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
    marginBottom: '0.5rem',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '0.5rem 0',
  },
  descFormatting: {
    fontSize: '0.98rem',
    lineHeight: 1.6,
    color: 'var(--text-main)',
  },
  voteBtnOverrides: {
    padding: '4px',
    borderRadius: '4px',
  },
  acceptedLabel: {
    fontSize: '0.75rem',
    padding: '0.35rem 0.75rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  acceptBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
  },
  authorNameLink: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'var(--text-heading)',
  },
  authorMetaBadge: {
    fontSize: '0.65rem',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    padding: '1px 6px',
    borderRadius: '4px',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  answerActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    transition: 'color var(--transition-fast)',
  },
  answerTextarea: {
    minHeight: '160px',
    fontSize: '0.95rem',
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Style code snippets in descriptions nicely */
    .question-desc code, .answer-text code {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      background-color: var(--bg-main);
      padding: 0.2rem 0.4rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-heading);
    }
    .question-desc pre, .answer-text pre {
      font-family: var(--font-mono);
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      overflow-x: auto;
    }
    .question-desc pre code, .answer-text pre code {
      background-color: transparent;
      border: none;
      padding: 0;
    }
    .actionBtn:hover {
      color: var(--primary) !important;
    }
  `;
  document.head.appendChild(style);
}
