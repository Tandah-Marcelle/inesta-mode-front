import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton = ({ className = "", animate = true }: SkeletonProps) => {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      {...(animate && {
        animate: { opacity: [0.5, 1, 0.5] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      })}
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
    />
  );
};

// Specific skeleton components for dashboard
export const StatCardSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="p-4 rounded-xl bg-white/20">
        <Skeleton className="w-8 h-8" />
      </div>
    </div>
  </div>
);

export const ContentCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
            <Skeleton className="h-8 w-8 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-3 h-3 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    
    <div className="h-64 flex items-end justify-between px-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton 
          key={i} 
          className={`w-12 bg-gray-200`}
          style={{ height: `${Math.random() * 150 + 50}px` }}
        />
      ))}
    </div>
  </div>
);

export const ActivitySkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
    
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-48 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="w-1 h-1 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="w-4 h-4" />
        </div>
      ))}
    </div>
  </div>
);

export const QuickActionsSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-pulse">
    <div className="mb-6">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-40" />
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 bg-gray-200 rounded-xl flex flex-col items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="text-center">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="w-4 h-4 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Table skeleton for list pages
export const TableSkeleton = ({ rows = 8, columns = 5 }: { rows?: number; columns?: number }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-pulse">
    {/* Table header */}
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-pulse">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  </div>
);

// Form skeleton
export const FormSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-pulse">
    <Skeleton className="h-8 w-64 mb-6" />
    
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      
      <div className="flex justify-end gap-3 mt-6">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);