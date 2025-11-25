/**
 * Overlay backdrop for mobile sidebar
 * Provides:
 * - Visual focus on the sidebar content
 * - Click-outside-to-close functionality (HCI: error prevention)
 * - Smooth fade animation
 */
const SidebarOverlay = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div
      className="
        fixed inset-0 z-40
        bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        md:hidden
      "
      onClick={onClose}
      aria-hidden="true"
      data-testid="sidebar-overlay"
    />
  );
};

export default SidebarOverlay;

