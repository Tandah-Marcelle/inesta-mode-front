import { motion } from 'framer-motion';
import { 
  StatCardSkeleton, 
  ContentCardSkeleton, 
  ChartSkeleton, 
  ActivitySkeleton, 
  QuickActionsSkeleton,
  Skeleton 
} from './Skeleton';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 pb-8">
      {/* Header Skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-2xl border border-gray-200 animate-pulse"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-3" />
            <Skeleton className="h-5 w-80 mb-4" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="w-1 h-1 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="mt-6 sm:mt-0">
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </motion.div>

      {/* Main Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <StatCardSkeleton />
          </motion.div>
        ))}
      </div>

      {/* Content Management Stats Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <ContentCardSkeleton />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <ContentCardSkeleton />
        </motion.div>
      </div>

      {/* Additional Stats Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <StatCardSkeleton />
          </motion.div>
        ))}
      </div>

      {/* Charts and Analytics Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="lg:col-span-2"
        >
          <ChartSkeleton />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <ActivitySkeleton />
        </motion.div>
      </div>

      {/* Quick Actions Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <QuickActionsSkeleton />
      </motion.div>
    </div>
  );
};