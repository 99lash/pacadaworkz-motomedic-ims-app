import { ChevronFirst, ChevronLast, X } from 'lucide-react';
import logo from '../../../assets/logo-dark.png';

const SidebarHeader = ({ expanded, onToggle, isMobile = false }) => {
  return (
    <div className="p-4 pb-2 flex justify-between items-center">
      <img 
        src={logo} 
        className={`overflow-hidden transition-all ${expanded ? 'w-12' : 'w-0'}`}
        alt="Company logo"
      />
      
      {isMobile ? (
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Close navigation menu"
        >
          <X size={20} aria-hidden="true" />
        </button>
      ) : (
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronFirst size={20} aria-hidden="true" />
          ) : (
            <ChevronLast size={20} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
};

export default SidebarHeader;

