import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => setExpanded(prev => !prev);

  return (
    <aside className={`h-screen ${expanded ? 'w-64' : 'w-16'} min-w-0`} aria-label="Main navigation">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <SidebarHeader expanded={expanded} onToggle={toggleSidebar} />
        
        <ul className="flex-1 px-3 overflow-y-auto" role="menu">
          {children(expanded)}
        </ul>
        
        <SidebarFooter user={user} expanded={expanded} />
      </nav>
    </aside>
  );
};

export default Sidebar;