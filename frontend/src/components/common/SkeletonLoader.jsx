import React from 'react';

const SkeletonLoader = ({ type = 'default' }) => {
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
      <div className="space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        {/* Table Rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonForm = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/5"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="flex space-x-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  switch (type) {
    case 'card':
      return <SkeletonCard />;
    case 'table':
      return <SkeletonTable />;
    case 'form':
      return <SkeletonForm />;
    case 'stats':
      return <SkeletonStats />;
    default:
      return (
        <div className="space-y-6">
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      );
  }
};

export default SkeletonLoader;

