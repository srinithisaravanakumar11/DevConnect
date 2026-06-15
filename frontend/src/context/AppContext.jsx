import { createContext, useState, useEffect } from 'react';
import API from '../services/api';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // Verify token and load current user profile + questions on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.get("/users/me");
          setCurrentUser(res.data);
          await fetchNotifications();
        } catch (err) {
          console.error("Token validation failed:", err);
          logout();
        }
      }
      setAuthLoading(false);
    };

    const loadQuestions = async () => {
      try {
        const response = await API.get('/questions/');
        setQuestions(response.data);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    checkAuth();
    loadQuestions();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Fetch questions function for refreshes on actions
  const fetchQuestions = async () => {
    try {
      const response = await API.get('/questions/');
      setQuestions(response.data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await API.get("/notifications/");
      console.log("NOTIFICATIONS:", response.data);
      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // Login
  const login = async (emailOrUsername, password) => {
    const formData = new URLSearchParams();
    formData.append("username", emailOrUsername);
    formData.append("password", password);

    const response = await API.post("/users/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const token = response.data.access_token;
    localStorage.setItem("token", token);

    // Fetch the authenticated user's profile
    const profileRes = await API.get("/users/me");
    setCurrentUser(profileRes.data);
    
    // Refresh questions feed
    await fetchQuestions();
    await fetchNotifications();

    return { success: true };
  };

  // Register
  const register = async (userDetails) => {
    await API.post("/users/", {
      username: userDetails.username,
      email: userDetails.email,
      password: userDetails.password,
      bio: userDetails.bio || '',
      location: userDetails.location || '',
      skills: userDetails.skills ? userDetails.skills.join(",") : '',
      experience: userDetails.experienceLevel || 'Beginner'
    });
    return { success: true };
  };

  // Update profile in PostgreSQL
  const updateProfile = async (profileData) => {
    if (!currentUser) return;
    try {
      const response = await API.put(`/users/${currentUser.user_id}`, {
        bio: profileData.bio,
        location: profileData.location,
        skills: profileData.skills ? profileData.skills.join(",") : '',
        experience: profileData.experienceLevel || profileData.experience || 'Beginner'
      });
      setCurrentUser(response.data);
      // Re-fetch questions to update answers/questions by this author
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // Add Question
  const addQuestion = async (title, category, description) => {
    if (!currentUser) return;
    try {
      await API.post('/questions/', {
        title,
        category,
        description
      });
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to add question:", err);
    }
  };

  // Vote Question
  const voteQuestion = async (questionId) => {
    if (!currentUser) return;
    try {
      const numericId = typeof questionId === 'string' && questionId.startsWith('q')
        ? parseInt(questionId.substring(1), 10)
        : questionId;

      await API.post(`/questions/${numericId}/vote`);
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to vote question:", err);
    }
  };

  // Add Answer
  const addAnswer = async (questionId, content) => {
    if (!currentUser) return;
    try {
      const numericId = typeof questionId === 'string' && questionId.startsWith('q')
        ? parseInt(questionId.substring(1), 10)
        : questionId;

      await API.post('/answers/', {
        answer_text: content,
        question_id: numericId
      });
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to add answer:", err);
    }
  };

  // Accept Answer
  const acceptAnswer = async (questionId, answerId) => {
    if (!currentUser) return;
    try {
      const numericAnswerId = typeof answerId === 'string' && answerId.startsWith('a')
        ? parseInt(answerId.substring(1), 10)
        : answerId;

      await API.post(`/answers/${numericAnswerId}/accept`);
      await fetchQuestions();
    } catch (err) {
      console.error("Failed to accept answer:", err);
    }
  };

  // Comment Actions
  const addComment = (questionId, answerId, text) => {
    console.log("Add comment locally:", { questionId, answerId, text });
  };

  // Notification Actions
  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notifId) => {
    setNotifications(prev => prev.filter(n => n.notification_id !== notifId));
  };

  // Dashboard calculations
  const getDashboardStats = () => {
    const totalQuestions = questions.length;
    let totalAnswers = 0;
    let solvedQuestions = 0;

    questions.forEach(q => {
      totalAnswers += (q.answers || []).length;
      if (q.status === 'Solved') {
        solvedQuestions++;
      }
    });

    const unsolvedQuestions = totalQuestions - solvedQuestions;
    const solutionRate = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

    return {
      totalMembers: 8,
      totalQuestions,
      totalAnswers,
      totalComments: 0,
      solvedQuestions,
      unsolvedQuestions,
      solutionRate,
      categoryCounts: {},
      contributors: []
    };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      questions,
      notifications,
      searchQuery,
      setSearchQuery,
      authLoading,
      login,
      register,
      logout,
      updateProfile,
      addQuestion,
      voteQuestion,
      addAnswer,
      acceptAnswer,
      addComment,
      markNotificationsAsRead,
      deleteNotification,
      getDashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
};
