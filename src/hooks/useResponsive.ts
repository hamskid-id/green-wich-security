import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      const isDesktopPlatform = isPlatform('desktop');
      
      setIsMobile(width < 768);
      setIsDesktop(isDesktopPlatform && width >= 768);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return { isMobile, isDesktop };
};