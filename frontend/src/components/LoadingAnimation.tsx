import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import nsutLogo from "@/assets/logo.png";

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
  const [isMounted, setIsMounted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
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

    if (!textGroup || !wiper || !loader || !logo) return;

    // We use a context/timeout to ensure the image has dimensions before measuring
    const ctx = gsap.context(() => {
        
      // 1. Calculate Dynamic Dimensions
      const textWidth = textGroup.offsetWidth;
      // Get actual rendered width of the logo (responsive)
      const logoWidth = logo.offsetWidth; 
      // Buffer space to ensure clean entry/exit
      const buffer = window.innerWidth < 768 ? 30 : 50; 

      // 2. Math for "Right to Left" Wipe
      // Center is 0. 
      // Start: Logo on the RIGHT of text
      const startX = (textWidth / 2) + (logoWidth / 2) + buffer;
      
      // End: Logo on the LEFT of text
      const endX = -((textWidth / 2) + (logoWidth / 2) + buffer);

      // 3. Set Initial State
      gsap.set(wiper, { x: startX, opacity: 1 });
      gsap.set(textGroup, { opacity: 1 });

      // 4. Run Animation - wipe once then FREEZE
      const tl = gsap.timeline({
        onComplete: () => {
          // Animation done - just freeze here, don't fade out yet
          setAnimationComplete(true);
          // Mark as visited so it doesn't play again
          sessionStorage.setItem("nalumHasVisited", "true");
        },
      });

      tl.to(wiper, {
        x: endX,
        duration: 2.5,
        ease: "power2.inOut",
        delay: 0.2,
      });
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
      {/* 1. TEXT LAYER (Bottom) */}
      <div ref={textGroupRef} className="relative z-0 text-center opacity-0">
        <h1 className="text-3xl md:text-6xl font-bold leading-none tracking-wide text-white whitespace-nowrap">
          <span className="text-red-600">N</span>SUT
          <span className="text-red-600"> ALUM</span>NI
        </h1>
        <span className="block text-sm md:text-2xl text-white mt-2 font-bold tracking-widest">
          ASSOCIATION
        </span>
      </div>

      {/* 2. WIPER LAYER (Top) */}
      {/* Centered absolutely so GSAP x transforms work from center */}
      <div 
        ref={wiperRef} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center opacity-0"
      >
        {/* THE MASK (The Curtain) */}
        {/* - anchored to right-0 (aligns with right side of logo) 
            - w-[300vw] ensures it covers EVERYTHING to the left 
            - z-index -1 puts it behind the logo but above the text
        */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300vw] h-[200vh] bg-black -z-10"></div>
        
        {/* THE LOGO */}
        <img
          ref={logoRef}
          src={nsutLogo}
          alt="Logo"
          // Responsive height: smaller on mobile, larger on desktop
          className="relative z-20 h-20 md:h-32 w-auto object-contain"
          // Ensure image loads before we calculate width
          onLoad={() => setIsMounted(true)} 
        />
      </div>
    </div>
  );
}