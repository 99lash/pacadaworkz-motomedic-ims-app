import { ChevronFirst, ChevronLast } from 'lucide-react';
import logo from '../assets/logo-dark.png';

const SidebarHeader = ({ expanded, onToggle }) => {
  return (
    <div className="p-4 pb-2 flex justify-between items-center">
      <img 
        src={logo} 
        className={`overflow-hidden transition-all ${expanded ? 'w-12' : 'w-0'}`}
        alt="Company logo"
      />
      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-expanded={expanded}
      >
        {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
      </button>
    </div>
  );
};

export default SidebarHeader;