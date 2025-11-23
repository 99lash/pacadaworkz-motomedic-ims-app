const SidebarItem = ({ icon, text, active, expanded }) => {
  return (
    <li
      className={`
        relative flex items-center py-1 my-1
        font-normal rounded-md cursor-pointer
        transition-colors group
        ${expanded ? 'px-3 text-xs' : 'px-2 justify-center text-xs'}
        ${active
          ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
          : 'hover:bg-indigo-50 text-gray-600'
        }
      `}
      role="menuitem"
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      
      <span 
        className={`overflow-hidden transition-all whitespace-nowrap ${
          expanded ? 'w-52 ml-3 opacity-100' : 'w-0 ml-0 opacity-0'
        }`}
      >
        {text}
      </span>

      {/* Tooltip always present on hover */}
      <div
        className={`
          absolute rounded-md px-2 py-1 
          bg-indigo-100 text-indigo-800 text-xs
          invisible opacity-0 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          whitespace-nowrap pointer-events-none z-50
          ${expanded ? 'ml-6' : 'left-full ml-6'}
        `}
        role="tooltip"
      >
        {text}
      </div>
    </li>
  );
};

export default SidebarItem;