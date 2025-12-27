import { useEffect } from 'react';

/**
 * Custom hook to handle mobile viewport height changes
 * particularly when the keyboard appears/disappears
 * 
 * This sets a CSS custom property --vh that can be used
 * instead of vh units for more reliable mobile behavior
 */
export const useViewportHeight = () => {
  useEffect(() => {
    const setViewportHeight = () => {
      // Get the actual viewport height
      const vh = window.visualViewport?.height || window.innerHeight;
      // Set the CSS variable
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };

    // Set on mount
    setViewportHeight();

    // Update on resize and visual viewport changes
    window.addEventListener('resize', setViewportHeight);
    window.visualViewport?.addEventListener('resize', setViewportHeight);
    window.visualViewport?.addEventListener('scroll', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.visualViewport?.removeEventListener('resize', setViewportHeight);
      window.visualViewport?.removeEventListener('scroll', setViewportHeight);
    };
  }, []);
};
