import React from 'react';
const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Header = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div
    className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

Card.Title = ({ children, className = '', ...props }) => (
  <h3
    className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}
    {...props}
  >
    {children}
  </h3>
);

Card.Description = ({ children, className = '', ...props }) => (
  <p
    className={`mt-1 text-sm text-gray-600 dark:text-gray-400 ${className}`}
    {...props}
  >
    {children}
  </p>
);

export default Card;
