import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks';

const SidebarThemeToggle = ({ expanded }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses =
    'w-full flex items-center rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';
  const expandedClasses =
    'justify-between px-3 py-2 border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';
  const collapsedClasses =
    'justify-center p-2 border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900';

  return (
    <div className="px-3 pb-3">
      <button
        type="button"
        onClick={toggleTheme}
        className={`${baseClasses} ${expanded ? expandedClasses : collapsedClasses}`}
        aria-pressed={isDark}
        aria-label="Toggle color theme"
      >
        <div className="flex items-center gap-3">
          {isDark ? (
            <Sun className="h-4 w-4 text-yellow-300" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          )}
          {expanded && (
            <div className="text-left">
              <p className="text-sm font-semibold">
                {isDark ? 'Light mode' : 'Dark mode'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isDark ? 'Lights on' : 'Lights off'}
              </p>
            </div>
          )}
        </div>

        {expanded && (
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
              isDark
                ? 'bg-gray-900/70 text-yellow-200'
                : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {isDark ? 'dark' : 'light'}
          </span>
        )}
      </button>
    </div>
  );
};

export default SidebarThemeToggle;

