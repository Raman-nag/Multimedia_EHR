import React, { useState } from 'react';
import { 
  HeartIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

const StyleShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const stats = [
    { name: 'Total Patients', value: '2,543', change: '+12%', changeType: 'positive', icon: HeartIcon },
    { name: 'Active Doctors', value: '156', change: '+8%', changeType: 'positive', icon: UserGroupIcon },
    { name: 'Medical Records', value: '8,921', change: '+23%', changeType: 'positive', icon: DocumentTextIcon },
    { name: 'Success Rate', value: '98.5%', change: '+2.1%', changeType: 'positive', icon: ChartBarIcon },
  ];

  const notifications = [
    { id: 1, title: 'New Patient Record', message: 'Dr. Smith created a new record', time: '2 min ago', type: 'success' },
    { id: 2, title: 'Access Request', message: 'City Hospital requested access', time: '1 hour ago', type: 'warning' },
    { id: 3, title: 'System Update', message: 'Scheduled maintenance tonight', time: '3 hours ago', type: 'info' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Multimedia EHR Style Showcase
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Demonstrating our comprehensive design system with TailwindCSS
            </p>
          </div>
          <ThemeToggle variant="switch" size="lg" showLabel />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.name} className="dashboard-card animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="stats-icon primary">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medical Record Card */}
          <div className="medical-record-card">
            <div className="record-header">
              <div>
                <h3 className="record-title">Patient Medical Record</h3>
                <p className="record-date">Created on March 15, 2024</p>
              </div>
              <span className="record-status active">Active</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Patient ID</span>
                <span className="font-mono text-sm">#P-2024-001</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Doctor</span>
                <span className="text-sm font-medium">Dr. Sarah Johnson</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                <span className="text-sm font-medium text-success-600 dark:text-success-400">Completed</span>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="dashboard-widget">
            <div className="widget-header">
              <h3 className="widget-title">Recent Notifications</h3>
              <button className="widget-action">
                <BellIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="widget-content">
              {notifications.map((notification, index) => (
                <div key={notification.id} className="activity-item animate-slide-in-right" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className={`activity-icon ${notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'primary'}`}>
                    {notification.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> :
                     notification.type === 'warning' ? <ExclamationTriangleIcon className="w-4 h-4" /> :
                     <BellIcon className="w-4 h-4" />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">{notification.title}</p>
                    <p className="activity-description">{notification.message}</p>
                    <p className="activity-time">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Example */}
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Contact Form</h2>
            <p className="form-subtitle">Send us a message and we'll get back to you</p>
          </div>
          
          <form className="form-section">
            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                className="form-textarea" 
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="form-button secondary"
                onClick={() => setFormData({name: '', email: '', message: ''})}
              >
                Clear
              </button>
              <button 
                type="button" 
                className="form-button primary"
                onClick={() => setShowModal(true)}
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Buttons Showcase */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h3 className="widget-title">Button Variants</h3>
          </div>
          <div className="widget-content">
            <div className="flex flex-wrap gap-4">
              <button className="medical-button">Primary Button</button>
              <button className="medical-button medical-button-secondary">Secondary Button</button>
              <button className="form-button danger">Danger Button</button>
              <button className="form-button secondary">Secondary Form</button>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h3 className="widget-title">Status Indicators</h3>
          </div>
          <div className="widget-content">
            <div className="flex flex-wrap gap-4">
              <span className="status-success">Success Status</span>
              <span className="status-warning">Warning Status</span>
              <span className="status-error">Error Status</span>
            </div>
          </div>
        </div>

        {/* Modal Example */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in-up">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Message Sent!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Thank you for your message. We'll get back to you within 24 hours.
              </p>
              <div className="flex justify-end">
                <button 
                  className="form-button primary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleShowcase;
