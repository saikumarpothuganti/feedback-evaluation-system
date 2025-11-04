import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FeedbackDB from '../utils/feedbackDB.js';

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
    // Load feedbacks from the new database
    loadFeedbacks();
  }, []);

  const loadFeedbacks = () => {
    const allFeedbacks = FeedbackDB.getAllFeedbacks();
    setFeedbacks(allFeedbacks);
  };

  const addFeedback = (feedback) => {
    const newFeedback = {
      ...feedback,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };
    
    FeedbackDB.addFeedback(newFeedback);
    loadFeedbacks();
  };

  const updateFeedback = (id, updates) => {
    FeedbackDB.updateFeedback(id, updates);
    loadFeedbacks();
  };

  const deleteFeedback = (id) => {
    FeedbackDB.deleteFeedback(id);
    loadFeedbacks();
  };

  const getFeedbackStats = () => {
    return FeedbackDB.getFeedbackStats();
  };

  const getFilteredFeedbacks = (filter = 'all') => {
    if (filter === 'all') return feedbacks;
    return FeedbackDB.getFilteredFeedbacks({ userRole: filter });
  };

  const searchFeedbacks = (keyword) => {
    return FeedbackDB.searchFeedbacks(keyword);
  };

  const value = {
    feedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedbackStats,
    getFilteredFeedbacks,
    searchFeedbacks,
    IMPROVEMENT_LABELS
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};
