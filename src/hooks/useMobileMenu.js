import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing mobile menu state
 * Handles:
 * - Mobile breakpoint detection
 * - Menu open/close state
 * - Body scroll lock when menu is open
 * - Escape key to close menu
 * - Resize handling
 */
const MOBILE_BREAKPOINT = 768; // md breakpoint in Tailwind

export const useMobileMenu = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      
      // Close menu when switching to desktop
      if (!mobile && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isMobile]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  return {
    isMobile,
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
};

export default useMobileMenu;

