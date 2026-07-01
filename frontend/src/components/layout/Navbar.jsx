import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, LogOut, Bell } from 'lucide-react';
import { toggleMobileSidebar, toggleTheme } from '../../redux/uiSlice';
import { logoutUser } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';

const Navbar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useSelector((state) => state.ui.theme);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-4 bg-white/80 dark:bg-surface-darkCard/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <button onClick={() => dispatch(toggleMobileSidebar())} className="lg:hidden text-gray-500">
        <Menu size={22} />
      </button>

      {onSearch && (
        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, orders, SKUs..."
            onChange={(e) => onSearch(e.target.value)}
            className="input pl-10 bg-gray-50 dark:bg-gray-900 border-transparent"
          />
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-gray-200 dark:border-gray-700">
          <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize leading-tight">{user?.role}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="p-2 text-gray-400 hover:text-danger-600">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
