// Feedback Database Utility - localStorage-based persistence for feedback data

const FEEDBACK_DB_KEY = 'feedbackDatabase';

/**
 * Initialize the feedback database if it doesn't exist
 */
const initDB = () => {
  const db = localStorage.getItem(FEEDBACK_DB_KEY);
  if (!db) {
    const initialDB = {
      feedbacks: [],
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(FEEDBACK_DB_KEY, JSON.stringify(initialDB));
    return initialDB;
  }
  return JSON.parse(db);
};

/**
 * Save the database to localStorage
 */
const saveDB = (db) => {
  db.lastUpdated = new Date().toISOString();
  localStorage.setItem(FEEDBACK_DB_KEY, JSON.stringify(db));
};

/**
 * Get all feedbacks from the database
 */
export const getAllFeedbacks = () => {
  const db = initDB();
  return db.feedbacks || [];
};

/**
 * Get feedback by ID
 */
export const getFeedbackById = (id) => {
  const db = initDB();
  return db.feedbacks.find(f => f.id === id);
};

/**
 * Add a new feedback to the database
 */
export const addFeedback = (feedbackData) => {
  const db = initDB();
  
  const newFeedback = {
    id: Date.now(),
    ...feedbackData,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString(),
    status: 'pending' // pending, reviewed, resolved
  };
  
  db.feedbacks.push(newFeedback);
  saveDB(db);
  
  return newFeedback;
};

/**
 * Update an existing feedback
 */
export const updateFeedback = (id, updates) => {
  const db = initDB();
  const index = db.feedbacks.findIndex(f => f.id === id);
  
  if (index !== -1) {
    db.feedbacks[index] = {
      ...db.feedbacks[index],
      ...updates,
      lastModified: new Date().toISOString()
    };
    saveDB(db);
    return db.feedbacks[index];
  }
  
  return null;
};

/**
 * Delete a feedback by ID
 */
export const deleteFeedback = (id) => {
  const db = initDB();
  const initialLength = db.feedbacks.length;
  db.feedbacks = db.feedbacks.filter(f => f.id !== id);
  
  if (db.feedbacks.length < initialLength) {
    saveDB(db);
    return true;
  }
  
  return false;
};

/**
 * Get feedbacks filtered by criteria
 */
export const getFilteredFeedbacks = (filter = {}) => {
  const db = initDB();
  let feedbacks = db.feedbacks;
  
  if (filter.userRole) {
    feedbacks = feedbacks.filter(f => f.userRole === filter.userRole);
  }
  
  if (filter.status) {
    feedbacks = feedbacks.filter(f => f.status === filter.status);
  }
  
  if (filter.feedbackType) {
    feedbacks = feedbacks.filter(f => 
      (f.feedbackType || f.method) === filter.feedbackType
    );
  }
  
  if (filter.dateFrom) {
    feedbacks = feedbacks.filter(f => 
      new Date(f.timestamp) >= new Date(filter.dateFrom)
    );
  }
  
  if (filter.dateTo) {
    feedbacks = feedbacks.filter(f => 
      new Date(f.timestamp) <= new Date(filter.dateTo)
    );
  }
  
  if (filter.rating) {
    feedbacks = feedbacks.filter(f => 
      parseInt(f.rating) === parseInt(filter.rating)
    );
  }
  
  return feedbacks;
};

/**
 * Get feedback statistics
 */
export const getFeedbackStats = () => {
  const db = initDB();
  const feedbacks = db.feedbacks;
  
  const total = feedbacks.length;
  const byRole = {
    student: feedbacks.filter(f => f.userRole === 'student').length,
    faculty: feedbacks.filter(f => f.userRole === 'faculty').length
  };
  
  const byStatus = {
    pending: feedbacks.filter(f => f.status === 'pending').length,
    reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length
  };
  
  const byType = {
    academics: feedbacks.filter(f => 
      (f.feedbackType || f.method) === 'academics' || 
      (f.feedbackType || f.method) === 'academic'
    ).length,
    hostel: feedbacks.filter(f => 
      (f.feedbackType || f.method) === 'hostel'
    ).length,
    disciplinary: feedbacks.filter(f => 
      (f.feedbackType || f.method) === 'disciplinary'
    ).length
  };
  
  const avgRating = feedbacks.length > 0
    ? feedbacks
        .filter(f => f.rating)
        .reduce((sum, f) => sum + parseInt(f.rating), 0) / 
      feedbacks.filter(f => f.rating).length
    : 0;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyFeedback = feedbacks.filter(f => {
    const feedbackDate = new Date(f.timestamp);
    return feedbackDate.getMonth() === currentMonth && 
           feedbackDate.getFullYear() === currentYear;
  }).length;
  
  return {
    total,
    byRole,
    byStatus,
    byType,
    avgRating: avgRating.toFixed(1),
    monthlyFeedback
  };
};

/**
 * Search feedbacks by keyword
 */
export const searchFeedbacks = (keyword) => {
  const db = initDB();
  const lowerKeyword = keyword.toLowerCase();
  
  return db.feedbacks.filter(f => {
    return (
      (f.comments && f.comments.toLowerCase().includes(lowerKeyword)) ||
      (f.suggestions && f.suggestions.toLowerCase().includes(lowerKeyword)) ||
      (f.courseName && f.courseName.toLowerCase().includes(lowerKeyword)) ||
      (f.subjectName && f.subjectName.toLowerCase().includes(lowerKeyword)) ||
      (f.instructorName && f.instructorName.toLowerCase().includes(lowerKeyword)) ||
      (f.hostelName && f.hostelName.toLowerCase().includes(lowerKeyword))
    );
  });
};

/**
 * Clear all feedbacks (use with caution)
 */
export const clearAllFeedbacks = () => {
  const db = {
    feedbacks: [],
    lastUpdated: new Date().toISOString()
  };
  saveDB(db);
  return true;
};

/**
 * Export feedbacks as JSON
 */
export const exportFeedbacks = () => {
  const db = initDB();
  return JSON.stringify(db.feedbacks, null, 2);
};

/**
 * Import feedbacks from JSON
 */
export const importFeedbacks = (jsonData) => {
  try {
    const feedbacks = JSON.parse(jsonData);
    if (!Array.isArray(feedbacks)) {
      throw new Error('Invalid format: expected an array');
    }
    
    const db = initDB();
    db.feedbacks = feedbacks;
    saveDB(db);
    
    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
};

export default {
  getAllFeedbacks,
  getFeedbackById,
  addFeedback,
  updateFeedback,
  deleteFeedback,
  getFilteredFeedbacks,
  getFeedbackStats,
  searchFeedbacks,
  clearAllFeedbacks,
  exportFeedbacks,
  importFeedbacks
};
