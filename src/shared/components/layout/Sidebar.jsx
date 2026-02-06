import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../features/auth';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarThemeToggle from './SidebarThemeToggle';
import SidebarOverlay from './SidebarOverlay';

const Sidebar = ({ 
  children, 
  isMobile = false, 
  isMenuOpen = false, 
  onCloseMenu 
}) => {
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setExpanded(prev => !prev);

  useEffect(() => {
    if (isMobile && isMenuOpen && sidebarRef.current) {
      const firstFocusable = sidebarRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isMobile, isMenuOpen]);

  const handleMenuItemClick = () => {
    if (isMobile && onCloseMenu) {
      // Blur the focused element to prevent focus from being trapped in the hidden sidebar
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      onCloseMenu();
    }
  };

  const getSidebarClasses = () => {
    const baseClasses = 'h-screen min-w-0 transition-all duration-300 ease-in-out';
    
    if (isMobile) {
      return `
        ${baseClasses}
        fixed top-0 left-0 z-50
        w-64
        transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `;
    }
    
    return `
      ${baseClasses}
      ${expanded ? 'w-64' : 'w-16'}
      hidden md:block
    `;
  };

  return (
    <>
      <SidebarOverlay isVisible={isMobile && isMenuOpen} onClose={onCloseMenu} />
      
      <aside 
        ref={sidebarRef}
        id="mobile-sidebar"
        className={getSidebarClasses()}
        aria-label="Main navigation"
        inert={isMobile && !isMenuOpen ? true : undefined}
      >
        <nav className="h-full flex flex-col bg-white border-r shadow-sm text-gray-900 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800">
          <SidebarHeader 
            expanded={isMobile ? true : expanded} 
            onToggle={isMobile ? onCloseMenu : toggleSidebar}
            isMobile={isMobile}
          />
          
          <ul 
            className="flex-1 px-3 overflow-y-auto" 
            role="menu"
            onClick={handleMenuItemClick}
          >
            {children(isMobile ? true : expanded)}
          </ul>

          <SidebarThemeToggle expanded={isMobile ? true : expanded} />
          
          <SidebarFooter user={user} expanded={isMobile ? true : expanded} />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

