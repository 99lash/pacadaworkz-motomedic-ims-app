import { Link, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarItem from './SidebarItem';
import MobileMenuButton from './MobileMenuButton';
import { useFilteredMenu } from '../hooks/useFilteredMenu';
import { useMobileMenu } from '../hooks/useMobileMenu';
import logo from '../assets/logo-dark.png';

const MainLayout = () => {
  const location = useLocation();
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
    <div className="h-screen flex flex-col">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-3 bg-white border-b shadow-sm">
        <MobileMenuButton 
          isOpen={isMenuOpen} 
          onToggle={toggleMenu}
        />
        <img 
          src={logo} 
          className="w-10 h-10 object-contain"
          alt="Company logo"
        />
        {/* Spacer for centering logo */}
        <div className="w-10" aria-hidden="true" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar 
          isMobile={false}
        >
          {renderNavItems}
        </Sidebar>

        {/* Mobile Sidebar (Drawer) */}
        {isMobile && (
          <Sidebar
            isMobile={true}
            isMenuOpen={isMenuOpen}
            onCloseMenu={closeMenu}
          >
            {renderNavItems}
          </Sidebar>
        )}
        
        <main 
          className="flex-grow p-4 bg-gray-50 overflow-auto min-w-0"
          id="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
