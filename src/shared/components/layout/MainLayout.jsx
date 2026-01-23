import { Link, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Import the new Header
import SidebarItem from './SidebarItem';
import MobileMenuButton from './MobileMenuButton';
import { useAuth } from '../../../features/auth';
import { useFilteredMenu } from '../../hooks/useFilteredMenu';
import { useMobileMenu } from '../../hooks/useMobileMenu';
import logo from '../../../assets/logo-dark.png';

const MainLayout = () => {
  const location = useLocation();
  useAuth();
  const filteredMenu = useFilteredMenu();
  const { isMobile, isMenuOpen, closeMenu, toggleMenu } = useMobileMenu();

  const renderNavItems = (expanded) => (
    <>
      {filteredMenu.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link 
            key={item.permission} 
            to={item.path}
            aria-current={isActive ? 'page' : undefined}
          >
            <SidebarItem
              icon={<Icon size={16} />}
              text={item.text}
              active={isActive}
              expanded={expanded}
            />
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="h-screen flex bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
      
      {/* Sidebar for both mobile (as a drawer) and desktop */}
      <Sidebar 
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        onCloseMenu={closeMenu}
      >
        {renderNavItems}
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Mobile Header - only contains menu toggle and logo */}
        <header className="md:hidden flex items-center justify-between p-3 bg-white border-b shadow-sm dark:bg-gray-950 dark:border-gray-800">
          <MobileMenuButton 
            isOpen={isMenuOpen} 
            onToggle={toggleMenu}
          />
          <img 
            src={logo} 
            className="w-10 h-10 object-contain"
            alt="Company logo"
          />
          <div className="w-10" aria-hidden="true" />
        </header>

        {/* Desktop Header - shown only on md and larger screens */}
        <div className="hidden md:block">
          <Header />
        </div>

        <main 
          className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto"
          id="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

