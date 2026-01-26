import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth';
import MobileMenuButton from './MobileMenuButton';

const formatPHDateTime = (date) => {
  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    timeZone: 'Asia/Manila',
    hour12: true 
  };
  
  const dateOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Manila'
  };

  const timeStr = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
  const dateStr = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

  return `${timeStr} ${dateStr}`;
};

export default function Header({ isMobile, isMenuOpen, onToggleMenu }) {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const userName = user?.name || 'user';

  return (
    <header className="bg-white px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center gap-4">
        {isMobile && (
          <MobileMenuButton isOpen={isMenuOpen} onToggle={onToggleMenu} />
        )}
        
        {!isMobile && (
          <div>
            <h1 className="text-gray-900 text-lg font-medium dark:text-gray-100">
              Welcome back, {user?.first_name || userName.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 text-sm mt-0.5 dark:text-gray-400 font-poppins">
              {formatPHDateTime(now)}
            </p>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="flex-1 text-center pr-10">
          <p className="text-gray-500 text-[10px] xs:text-xs sm:text-sm dark:text-gray-400 font-poppins whitespace-nowrap">
            {formatPHDateTime(now)}
          </p>
        </div>
      )}

      {/* Right section empty as requested */}
    </header>
  );
}
