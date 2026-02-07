import { Link, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Import the new Header
import SidebarItem from './SidebarItem';
import { useAuth } from '../../../features/auth';
import { useFilteredMenu } from '../../hooks/useFilteredMenu';
import { useMobileMenu } from '../../hooks/useMobileMenu';

const MainLayout = () => {
  const location = useLocation();
  useAuth();
  const filteredMenu = useFilteredMenu();
  const { isMobile, isTablet, isMenuOpen, closeMenu, toggleMenu } = useMobileMenu();

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
        isTablet={isTablet}
        isMenuOpen={isMenuOpen}
        onCloseMenu={closeMenu}
      >
        {renderNavItems}
      </Sidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Responsive Header for all screen sizes */}
        <Header 
          isMobile={isMobile}
          isMenuOpen={isMenuOpen}
          onToggleMenu={toggleMenu}
        />

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

