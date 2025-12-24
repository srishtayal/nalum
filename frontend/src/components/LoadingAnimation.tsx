import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import nsutLogo from "@/assets/logo.webp";

interface LoadingAnimationProps {
  onAnimationComplete?: () => void;
  skipAnimation?: boolean;
  isContentReady?: boolean; // Signal from parent that content is loaded
}

export function LoadingAnimation({
  onAnimationComplete,
  skipAnimation = false,
  isContentReady = false,
}: LoadingAnimationProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const wiperRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if user has visited before
    const hasVisited = sessionStorage.getItem("nalumHasVisited");

    if (skipAnimation || hasVisited) {
      onAnimationComplete?.();
      return;
    }

    const textGroup = textGroupRef.current;
    const wiper = wiperRef.current;
    const loader = loaderRef.current;
    const logo = logoRef.current;

    if (!textGroup || !loader || !logo) return;
    if (!isMobile && !wiper) return; // wiper only needed for desktop

    // Detect if mobile
    const isSmallScreen = window.innerWidth < 768;

    // We use a context/timeout to ensure the image has dimensions before measuring
    const ctx = gsap.context(() => {
      
      if (isSmallScreen) {
        // === MOBILE ANIMATION ===
        // 1. Logo fades in and scales up at the top
        // 2. Text slides in from the right
        
        gsap.set(logo, { opacity: 0, scale: 0.8, y: -20 });
        gsap.set(textGroup, { opacity: 0, x: 50 });

        const tl = gsap.timeline({
          onComplete: () => {
            setAnimationComplete(true);
            sessionStorage.setItem("nalumHasVisited", "true");
          },
        });

        // Step 1: Logo appears and settles
        tl.to(logo, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.2,
        });

        // Step 2: Text slides in from right
        tl.to(textGroup, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
        }, "-=0.4"); // Overlap with logo animation

      } else {
        // === DESKTOP ANIMATION (Original) ===
        if (!wiper) return;
        
        const textWidth = textGroup.offsetWidth;
        const logoWidth = logo.offsetWidth; 
        const buffer = 50;

        const startX = (textWidth / 2) + (logoWidth / 2) + buffer;
        const endX = -((textWidth / 2) + (logoWidth / 2) + buffer);

        gsap.set(wiper, { x: startX, opacity: 1 });
        gsap.set(textGroup, { opacity: 1 });

        const tl = gsap.timeline({
          onComplete: () => {
            setAnimationComplete(true);
            sessionStorage.setItem("nalumHasVisited", "true");
          },
        });

        tl.to(wiper, {
          x: endX,
          duration: 2.5,
          ease: "power2.inOut",
          delay: 0.2,
        });
      }
    });

    return () => ctx.revert();
  }, [skipAnimation, isMounted]);

  // Separate effect: Fade out only when BOTH animation is done AND content is ready
  useEffect(() => {
    if (animationComplete && isContentReady) {
      const loader = loaderRef.current;
      if (!loader) return;

      // Now fade out and reveal the content
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          if (loader) loader.style.display = "none";
          onAnimationComplete?.();
        },
      });
    }
  }, [animationComplete, isContentReady, onAnimationComplete]);

  // If skipping, don't render anything to avoid a flash of black
  if (skipAnimation) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
    >
      {isMobile ? (
        // MOBILE LAYOUT: Logo on top, text below
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Logo positioned above */}
          <img
            ref={logoRef}
            src={nsutLogo}
            alt="Logo"
            className="h-20 w-auto object-contain"
            onLoad={() => setIsMounted(true)} 
          />
          
          {/* Text below */}
          <div ref={textGroupRef} className="text-center">
            <h1 className="text-4xl font-bold leading-none tracking-wide text-white whitespace-nowrap px-4">
              <span className="text-red-600">N</span>SUT
              <span className="text-red-600"> ALUM</span>NI
            </h1>
            <span className="block text-xs text-white mt-2 font-bold tracking-widest">
              ASSOCIATION
            </span>
          </div>
        </div>
      ) : (
        // DESKTOP LAYOUT: Original wipe animation
        <div className="w-full h-full relative">
          {/* 1. TEXT LAYER (Bottom) */}
          <div ref={textGroupRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 text-center opacity-0">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-none tracking-wide text-white whitespace-nowrap">
              <span className="text-red-600">N</span>SUT
              <span className="text-red-600"> ALUM</span>NI
            </h1>
            <span className="block text-lg lg:text-xl xl:text-2xl text-white mt-2 font-bold tracking-widest">
              ASSOCIATION
            </span>
          </div>

          {/* 2. WIPER LAYER (Top) */}
          <div 
            ref={wiperRef} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center opacity-0"
          >
            {/* THE MASK (The Curtain) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300vw] h-[200vh] bg-black -z-10"></div>
            
            {/* THE LOGO */}
            <img
              ref={logoRef}
              src={nsutLogo}
              alt="Logo"
              className="relative z-20 h-28 lg:h-32 w-auto object-contain"
              onLoad={() => setIsMounted(true)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}