import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ variant = 'button', size = 'md', showLabel = false }) => {
  const { theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'dropdown') {
    return (
      <div className="relative group">
        <button className={`${sizes[size]} rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors`}>
          {theme === 'light' ? (
            <SunIcon className={`${iconSizes[size]} text-slate-600 dark:text-slate-400`} />
          ) : theme === 'dark' ? (
            <MoonIcon className={`${iconSizes[size]} text-slate-600 dark:text-slate-400`} />
          ) : (
            <ComputerDesktopIcon className={`${iconSizes[size]} text-slate-600 dark:text-slate-400`} />
          )}
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <button
            onClick={setLightTheme}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-3 ${
              theme === 'light' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <SunIcon className="w-4 h-4" />
            <span>Light</span>
          </button>
          <button
            onClick={setDarkTheme}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-3 ${
              theme === 'dark' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <MoonIcon className="w-4 h-4" />
            <span>Dark</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('theme');
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              setTheme(systemTheme);
            }}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-3 ${
              !localStorage.getItem('theme') ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <ComputerDesktopIcon className="w-4 h-4" />
            <span>System</span>
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <div className="flex items-center space-x-3">
        <SunIcon className={`${iconSizes[size]} text-slate-400 ${theme === 'light' ? 'text-yellow-500' : ''}`} />
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            theme === 'dark' ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <MoonIcon className={`${iconSizes[size]} text-slate-400 ${theme === 'dark' ? 'text-blue-500' : ''}`} />
        {showLabel && (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {theme === 'light' ? 'Light' : 'Dark'} mode
          </span>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <button
      onClick={toggleTheme}
      className={`${sizes[size]} rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className={`${iconSizes[size]} text-slate-600 dark:text-slate-400`} />
      ) : (
        <SunIcon className={`${iconSizes[size]} text-slate-600 dark:text-slate-400`} />
      )}
    </button>
  );
};

export default ThemeToggle;
