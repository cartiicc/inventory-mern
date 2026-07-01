import { motion } from 'framer-motion';

const colorMap = {
  primary: 'from-primary-500 to-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-500/10',
  success: 'from-success-500 to-success-600 text-success-600 bg-success-100 dark:bg-success-500/10',
  warning: 'from-warning-500 to-warning-600 text-warning-600 bg-warning-100 dark:bg-warning-500/10',
  danger: 'from-danger-500 to-danger-600 text-danger-600 bg-danger-100 dark:bg-danger-500/10',
};

/**
 * Glassmorphism stat card used across the dashboard.
 */
const StatCard = ({ icon: Icon, label, value, color = 'primary', trend, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-5 flex items-center justify-between hover:shadow-lg transition-shadow"
    >
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        {loading ? (
          <div className="skeleton h-8 w-24 mt-2" />
        ) : (
          <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</h3>
        )}
        {trend !== undefined && !loading && (
          <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={24} />
      </div>
    </motion.div>
  );
};

export default StatCard;
