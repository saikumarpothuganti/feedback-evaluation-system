import React, { useState } from 'react';
import Navbar from './Navbar.jsx';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});

  const toggleHelp = (itemId) => {
    setExpandedItems({
      ...expandedItems,
      [itemId]: !expandedItems[itemId]
    });
  };

  const searchHelp = () => {
    alert(`Searching for: ${searchTerm}`);
  };

  const openSupportTicket = () => {
    alert('Opening support ticket form...');
  };

  const helpItems = [
    {
      id: 'login',
      category: 'Getting Started',
      title: 'How to Login',
      content: 'To login, select your role (Student, Faculty, or Admin) and enter your credentials. For demo purposes, you can use any username and password.'
    },
    {
      id: 'submit-feedback',
      category: 'Getting Started', 
      title: 'How to Submit Feedback',
      content: 'Navigate to the Student page, select your feedback type (Academic, Hostel, or Disciplinary), fill out the form with your details and comments, then click Submit.'
    },
    {
      id: 'academic-feedback',
      category: 'Student Guide',
      title: 'Academic Feedback',
      content: 'Academic feedback allows you to rate and comment on courses, instructors, teaching methods, and curriculum. Provide constructive feedback to help improve the academic experience.'
    },
    {
      id: 'hostel-feedback',
      category: 'Student Guide',
      title: 'Hostel Feedback',
      content: 'Use hostel feedback to report issues with accommodation, facilities, cleanliness, or hostel management. Include specific details about your hostel block and floor.'
    },
    {
      id: 'faculty-feedback',
      category: 'Faculty Guide',
      title: 'Faculty Academic Feedback',
      content: 'Faculty can provide feedback on curriculum design, teaching methodologies, assessment methods, and suggest improvements for better learning outcomes.'
    },
    {
      id: 'view-feedback',
      category: 'Admin Guide',
      title: 'Viewing and Managing Feedback',
      content: 'Admins can view all submitted feedback, filter by type or role, and generate reports. Use the Admin dashboard to monitor feedback trends and identify areas for improvement.'
    }
  ];

  const faqs = [
    {
      id: 'faq1',
      question: 'Is my feedback anonymous?',
      answer: 'Yes, all feedback is treated confidentially and used only for improvement purposes.'
    },
    {
      id: 'faq2',
      question: 'How often can I submit feedback?',
      answer: 'You can submit feedback as often as needed. There are no restrictions on the frequency of submissions.'
    },
    {
      id: 'faq3',
      question: 'Can I edit my feedback after submission?',
      answer: 'Currently, feedback cannot be edited after submission. Please review your feedback carefully before submitting.'
    }
  ];

  const filteredItems = helpItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="help-page">
      <Navbar title="Feedback Management System" showAllLinks={true} />
      
      <div className="container">
        <div className="card help-card">
          <h2>Help & Support Center</h2>
          
          <div className="help-search">
            <input 
              type="text" 
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn" onClick={searchHelp}>Search</button>
          </div>

          <div className="help-sections">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="help-section">
                <h3>
                  {category === 'Getting Started' && '📚 '}
                  {category === 'Student Guide' && '🎓 '}
                  {category === 'Faculty Guide' && '👨‍🏫 '}
                  {category === 'Admin Guide' && '👨‍💼 '}
                  {category}
                </h3>
                <div className="help-items">
                  {items.map(item => (
                    <div key={item.id} className="help-item" onClick={() => toggleHelp(item.id)}>
                      <h4>{item.title}</h4>
                      <div 
                        className={`help-content ${expandedItems[item.id] ? 'expanded' : ''}`}
                      >
                        <p>{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="help-section">
              <h3>❓ Frequently Asked Questions</h3>
              <div className="help-items">
                {faqs.map(faq => (
                  <div key={faq.id} className="help-item" onClick={() => toggleHelp(faq.id)}>
                    <h4>{faq.question}</h4>
                    <div 
                      className={`help-content ${expandedItems[faq.id] ? 'expanded' : ''}`}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-support">
            <h3>📞 Contact Support</h3>
            <div className="contact-info">
              <p><strong>Email:</strong> support@university.edu</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
            </div>
            <button className="btn" onClick={openSupportTicket}>
              Open Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
