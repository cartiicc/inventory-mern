import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, ShoppingCart, DollarSign, AlertTriangle, XCircle, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { fetchDashboardStats } from '../features/dashboard/dashboardSlice';
import StatCard from '../components/dashboard/StatCard';
import { formatCurrency, formatDate, orderStatusMeta } from '../utils/formatters';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';

const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentOrders, recentActivity, categoryDistribution, monthlySales, loading } = useSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Overview of your inventory performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="primary" loading={loading} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} color="primary" loading={loading} />
        <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(stats.revenue)} color="success" loading={loading} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={stats.lowStockCount} color="warning" loading={loading} />
        <StatCard icon={XCircle} label="Out of Stock" value={stats.outOfStockCount} color="danger" loading={loading} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryDistribution} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={85} label={(d) => d.category}>
                {categoryDistribution.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.length === 0 && <p className="text-sm text-gray-400">No orders yet.</p>}
            {recentOrders.map((order) => {
              const status = orderStatusMeta(order.orderStatus);
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.customerName} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(order.totalPrice)}</p>
                    <Badge className={status.className}>{status.label}</Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Activity size={16} /> Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 && <p className="text-sm text-gray-400">No recent activity.</p>}
            {recentActivity.map((log) => (
              <div key={log._id} className="flex gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm">{log.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
