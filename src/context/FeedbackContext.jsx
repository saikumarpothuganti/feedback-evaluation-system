import React, { createContext, useContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

const STORAGE_KEY = 'studentFeedbackSystem';

const IMPROVEMENT_LABELS = {
  'curriculum': 'Curriculum Design',
  'teaching-methods': 'Teaching Methods & Pedagogy',
  'assessment-evaluation': 'Assessment & Evaluation',
  'resources-infrastructure': 'Learning Resources & Infrastructure',
  'syllabus-pacing': 'Syllabus Coverage & Pacing',
  'student-engagement': 'Student Engagement & Interaction',
  'practical-labs': 'Practical/Lab Components',
  'industry-relevance': 'Industry Relevance'
};

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Load feedbacks from localStorage on component mount
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      setFeedbacks(parsedData.feedbacks || []);
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addFeedback = (feedback) => {
    const newFeedback = {
      ...feedback,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };
    
    const updatedFeedbacks = [...feedbacks, newFeedback];
    setFeedbacks(updatedFeedbacks);
    saveToLocalStorage({ feedbacks: updatedFeedbacks });
  };

  const getFeedbackStats = () => {
    const total = feedbacks.length;
    const studentFeedback = feedbacks.filter(f => f.userRole === 'student').length;
    const facultyFeedback = feedbacks.filter(f => f.userRole === 'faculty').length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyFeedback = feedbacks.filter(f => {
      const feedbackDate = new Date(f.timestamp);
      return feedbackDate.getMonth() === currentMonth && 
             feedbackDate.getFullYear() === currentYear;
    }).length;

    return {
      total,
      studentFeedback,
      facultyFeedback,
      monthlyFeedback
    };
  };

  const getFilteredFeedbacks = (filter = 'all') => {
    if (filter === 'all') return feedbacks;
    return feedbacks.filter(f => f.userRole === filter);
  };

  const deleteFeedback = (id) => {
    const updated = feedbacks.filter(f => f.id !== id);
    setFeedbacks(updated);
    saveToLocalStorage({ feedbacks: updated });
  };

  const flagFeedback = (id) => {
    const updated = feedbacks.map(f => {
      if (f.id === id) {
        return {
          ...f,
            flagged: true,
            flaggedTimestamp: new Date().toISOString()
        };
      }
      return f;
    });
    setFeedbacks(updated);
    saveToLocalStorage({ feedbacks: updated });
  };

  const value = {
    feedbacks,
    addFeedback,
    deleteFeedback,
    flagFeedback,
    getFeedbackStats,
    getFilteredFeedbacks,
    IMPROVEMENT_LABELS
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
