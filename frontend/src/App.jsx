import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuestionsFeed from './pages/QuestionsFeed';
import QuestionDetails from './pages/QuestionDetails';
import AskQuestion from './pages/AskQuestion';
import UserProfile from './pages/UserProfile';
import Notifications from './pages/Notifications';
import { AppContext } from './context/AppContext';

// Route Protection wrapper checking context authentication state
const ProtectedRoute = ({ children }) => {
  const { currentUser, authLoading } = useContext(AppContext);

  if (authLoading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Loading DevConnect...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default function App() {
  const { currentUser, authLoading } = useContext(AppContext);

  if (authLoading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser
            ? <Navigate to="/" replace />
            : <Login />
        }
      />
      <Route 
        path="/register" 
        element={
          currentUser
            ? <Navigate to="/" replace />
            : <Register />
        }
      />

      {/* Protected application layout routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <QuestionsFeed />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/questions/:id" 
        element={
          <ProtectedRoute>
            <QuestionDetails />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ask" 
        element={
          <ProtectedRoute>
            <AskQuestion />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/:username" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const styles = {
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-main)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--border-color)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

