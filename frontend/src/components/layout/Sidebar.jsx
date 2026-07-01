import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  User,
  Boxes,
  X,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobileSidebar } from '../../redux/uiSlice';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
  { to: '/products', label: 'Products', icon: Package, roles: ['admin', 'staff'] },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['admin', 'staff'] },
  { to: '/users', label: 'Staff', icon: Users, roles: ['admin'] },
  { to: '/profile', label: 'Profile', icon: User, roles: ['admin', 'staff'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'staff'] },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const mobileOpen = useSelector((state) => state.ui.mobileSidebarOpen);

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role));

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="p-2 bg-primary-600 rounded-xl text-white">
          <Boxes size={22} />
        </div>
        <span className="font-bold text-lg tracking-tight">InventoryMS</span>
        <button onClick={() => dispatch(closeMobileSidebar())} className="ml-auto lg:hidden text-gray-400">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => dispatch(closeMobileSidebar())}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r"
                  />
                )}
                <item.icon size={18} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white text-xs">
        <p className="font-semibold mb-1">Logged in as {user?.role}</p>
        <p className="opacity-80">{user?.email}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-darkCard h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => dispatch(closeMobileSidebar())} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-surface-darkCard shadow-xl"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
