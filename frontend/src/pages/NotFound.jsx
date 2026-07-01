import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-surface-dark p-4 text-center">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <Boxes size={48} className="mx-auto text-primary-600 mb-4" />
      <h1 className="text-7xl font-bold text-primary-600">404</h1>
      <p className="text-lg font-medium mt-2">Page not found</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/dashboard">
        <Button className="mt-6">Back to Dashboard</Button>
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
