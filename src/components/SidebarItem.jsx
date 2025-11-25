import { useState, useRef } from 'react';

const SidebarItem = ({ icon, text, active, expanded }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const itemRef = useRef(null);

  const handleMouseEnter = () => {
    if (!expanded && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <li
      ref={itemRef}
      className={`
        relative flex items-center py-1 my-1
        font-normal rounded-md cursor-pointer
        transition-colors group
        ${expanded ? 'px-3 text-xs' : 'px-2 justify-center text-xs'}
        ${
          active
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 text-gray-600'
        }
      `}
      role="menuitem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

      {!expanded && showTooltip && (
        <div
          className="fixed rounded-md px-2 py-1 bg-indigo-100 text-indigo-800 text-xs whitespace-nowrap pointer-events-none z-[9999] -translate-y-1/2"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
          role="tooltip"
        >
          {text}
        </div>
      )}
    </li>
  );
};

export default SidebarItem;