import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun, Bell, Globe } from 'lucide-react';
import { setTheme } from '../redux/uiSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Customize your workspace preferences</p>
      </div>

      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? <Sun size={20} className="text-warning-500" /> : <Moon size={20} className="text-primary-500" />}
            <div>
              <p className="font-medium">Appearance</p>
              <p className="text-xs text-gray-400">Switch between light and dark mode</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch(setTheme('light'))}
              className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'light' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              Light
            </button>
            <button
              onClick={() => dispatch(setTheme('dark'))}
              className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-primary-500" />
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-xs text-gray-400">Low stock & order alerts (managed server-side)</p>
            </div>
          </div>
          <span className="badge-success">Enabled</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-primary-500" />
            <div>
              <p className="font-medium">Currency</p>
              <p className="text-xs text-gray-400">Display currency for prices</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">USD ($)</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
