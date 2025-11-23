import { Link, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarItem from './SidebarItem';
import { useFilteredMenu } from '../hooks/useFilteredMenu';

const MainLayout = () => {
  const location = useLocation();
  const filteredMenu = useFilteredMenu();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          {(expanded) => (
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
          )}
        </Sidebar>
        
        <main className="flex-grow p-4 bg-gray-50 overflow-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;