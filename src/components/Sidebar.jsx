import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarOverlay from './SidebarOverlay';

/**
 * Responsive Sidebar component
 * - Desktop: Collapsible sidebar with expand/collapse toggle
 * - Mobile: Slide-out drawer with overlay
 * 
 * HCI Principles applied:
 * - Visibility: Clear navigation structure
 * - Feedback: Smooth transitions and hover states
 * - Consistency: Same content across breakpoints
 * - Accessibility: Focus trap, ARIA labels, keyboard navigation
 */
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

  // Focus management: trap focus within sidebar when open on mobile
  useEffect(() => {
    if (isMobile && isMenuOpen && sidebarRef.current) {
      // Focus the sidebar when it opens
      const firstFocusable = sidebarRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isMobile, isMenuOpen]);

  // Handle navigation item click on mobile - close menu after selection
  const handleMenuItemClick = () => {
    if (isMobile && onCloseMenu) {
      onCloseMenu();
    }
  };

  // Determine sidebar visibility and width
  const getSidebarClasses = () => {
    const baseClasses = 'h-screen min-w-0 transition-all duration-300 ease-in-out';
    
    if (isMobile) {
      // Mobile: Fixed position, slide from left
      return `
        ${baseClasses}
        fixed top-0 left-0 z-50
        w-64
        transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `;
    }
    
    // Desktop: Static position, collapsible width
    return `
      ${baseClasses}
      ${expanded ? 'w-64' : 'w-16'}
      hidden md:block
    `;
  };

  return (
    <>
      {/* Overlay for mobile */}
      <SidebarOverlay isVisible={isMobile && isMenuOpen} onClose={onCloseMenu} />
      
      <aside 
        ref={sidebarRef}
        id="mobile-sidebar"
        className={getSidebarClasses()}
        aria-label="Main navigation"
        aria-hidden={isMobile && !isMenuOpen}
      >
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
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
          
          <SidebarFooter user={user} expanded={isMobile ? true : expanded} />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
