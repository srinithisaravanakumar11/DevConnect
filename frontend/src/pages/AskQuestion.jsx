import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, HelpCircle, CheckCircle, Flame } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { CATEGORIES } from '../context/constants';


export default function AskQuestion() {
  const { addQuestion } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !category || !description.trim()) {
      setError('All fields are required.');
      return;
    }

    if (title.length < 15) {
      setError('Title must be at least 15 characters long to describe the issue.');
      return;
    }

    addQuestion(title, category, description);
    navigate('/questions');
  };

  const handleCancel = () => {
    navigate('/questions');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Ask a Public Question</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Be specific and imagine you're explaining your question to another developer.
        </p>
      </div>

      <div style={styles.formGrid}>
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="card" style={{ flex: 1 }}>
          {error && (
            <div style={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="q-title" style={{ fontWeight: 600 }}>
              Question Title
            </label>
            <p style={styles.formHint}>
              Be specific and clear. Imagine you're searching for this answer.
            </p>
            <input
              id="q-title"
              type="text"
              className="form-input"
              placeholder="e.g. How to handle state updates in React concurrent mode?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="q-category" style={{ fontWeight: 600 }}>
              Category Tag
            </label>
            <p style={styles.formHint}>
              Choose the technology tag that best matches your question.
            </p>
            <select
              id="q-category"
              className="form-input form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="q-desc" style={{ fontWeight: 600 }}>
              Detailed Description
            </label>
            <p style={styles.formHint}>
              Include the background context, outline what you tried, and embed any code snippets using markdown format.
            </p>
            <textarea
              id="q-desc"
              className="form-input form-textarea"
              placeholder="Include error codes, relevant environment details, and clear steps to reproduce..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.btnRow}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit Question
            </button>
          </div>
        </form>

        {/* Sidebar Help Widgets */}
        <aside style={styles.sidebar}>
          <div className="card" style={styles.widgetCard}>
            <div style={styles.widgetHeader}>
              <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
              <h4>How to ask a good question</h4>
            </div>
            <ul style={styles.helpList}>
              <li>
                <CheckCircle size={14} style={styles.checkIcon} />
                <span>**Summarize the problem**: Provide a descriptive, clear title.</span>
              </li>
              <li>
                <CheckCircle size={14} style={styles.checkIcon} />
                <span>**Describe what you tried**: Detail your attempts and why they failed.</span>
              </li>
              <li>
                <CheckCircle size={14} style={styles.checkIcon} />
                <span>**Include code blocks**: Wrap code snippets in three backticks.</span>
              </li>
              <li>
                <CheckCircle size={14} style={styles.checkIcon} />
                <span>**Check for duplicates**: Ensure your query hasn't been solved already.</span>
              </li>
            </ul>
          </div>

          <div className="card" style={{ ...styles.widgetCard, borderLeft: '4px solid #ef4444' }}>
            <div style={styles.widgetHeader}>
              <Flame size={18} style={{ color: '#ef4444' }} />
              <h4 style={{ color: '#ef4444' }}>Markdown Support</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              To post high-quality code snippets, wrap them in markdown syntax like this:
            </p>
            <pre style={styles.codeSnippetBlock}>
{`\`\`\`javascript
const test = "Hello World";
console.log(test);
\`\`\``}
            </pre>
          </div>
        </aside>
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
    marginBottom: '0.5rem',
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formHint: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '-0.35rem',
    marginBottom: '0.5rem',
  },
  textarea: {
    minHeight: '220px',
    fontSize: '0.92rem',
    fontFamily: 'inherit',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1.25rem',
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
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
  },
  widgetCard: {
    padding: '1.25rem',
  },
  widgetHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  helpList: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: 0,
  },
  checkIcon: {
    color: '#22c55e',
    flexShrink: 0,
    marginTop: '0.15rem',
  },
  codeSnippetBlock: {
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    padding: '0.5rem',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    marginTop: '0.5rem',
    overflowX: 'auto',
    color: 'var(--text-heading)',
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (min-width: 1024px) {
      .mobile-sidebar-drawer { display: none; }
      /* Inject layout split for desktop form grid */
      div[style*="formGrid"] {
        flex-direction: row !important;
        align-items: flex-start !important;
      }
      aside[style*="sidebar"] {
        width: 340px !important;
        flex-shrink: 0 !important;
      }
    }
    /* Bold text in tips help list */
    ul[style*="helpList"] li {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.82rem;
      line-height: 1.4;
    }
    ul[style*="helpList"] li span strong {
      color: var(--text-heading) !important;
    }
  `;
  document.head.appendChild(style);
}
export const styles_injected = true;
