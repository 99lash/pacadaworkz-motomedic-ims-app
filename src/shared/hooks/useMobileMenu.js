import { useState, useEffect, useCallback } from 'react';

const MOBILE_BREAKPOINT = 425;
const TABLET_BREAKPOINT = 768;
const LAPTOP_BREAKPOINT = 1024;

export const useMobileMenu = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const [isTablet, setIsTablet] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= TABLET_BREAKPOINT : false
  );
  const [isLaptop, setIsLaptop] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= LAPTOP_BREAKPOINT : false
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < MOBILE_BREAKPOINT;
      const tablet = width <= TABLET_BREAKPOINT;
      const laptop = width <= LAPTOP_BREAKPOINT;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsLaptop(laptop);
      
      if (!mobile && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

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
    isTablet,
    isLaptop,
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
};

export default useMobileMenu;

