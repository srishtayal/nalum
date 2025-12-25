import { useState, useEffect, useRef } from 'react';
import heroImage from '@/assets/hero.webp';

const Hero = () => {
  // Default main image
  const defaultImage = heroImage;

  // Slideshow images from public/homeGallery folder
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  // const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll animation for text
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetHeight;
        const currentScroll = window.scrollY;

        // Stop movement when image section ends
        if (currentScroll <= heroBottom) {
          setScrollY(currentScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slideshow logic - COMMENTED OUT
  // useEffect(() => {
  //   if (isPlaying) {
  //     intervalRef.current = setInterval(() => {
  //       setIsTransitioning(true);
  //       setTimeout(() => {
  //         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  //         setIsTransitioning(false);
  //       }, 500);
  //     }, 4000);
  //   } else {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, [isPlaying, images.length]);

  // Toggle play/pause - COMMENTED OUT
  // const toggleSlideshow = () => {
  //   if (isPlaying) {
  //     setIsPlaying(false);
  //     setIsTransitioning(true);
  //     setTimeout(() => {
  //       setCurrentImageIndex(-1);
  //       setIsTransitioning(false);
  //     }, 500);
  //   } else {
  //     setIsTransitioning(true);
  //     setTimeout(() => {
  //       setCurrentImageIndex(0);
  //       setIsPlaying(true);
  //       setIsTransitioning(false);
  //     }, 500);
  //   }
  // };

  return (
    <div
      ref={heroRef}
      className="relative h-screen text-white overflow-hidden"
      style={{ contain: 'layout' }}
    >
      {/* Background Images with crossfade */}
      <div className="absolute inset-0">
        {/* LCP optimized hero image */}
        <img
          src={defaultImage}
          alt="Hero background"
          width="1920"
          height="1080"
          fetchpriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content with scroll animation */}
      <div
        className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-4"
        style={{
          transform: `translate3d(0, ${Math.min(scrollY * 0.5, 200)}px, 0)`,
          willChange: scrollY > 0 && scrollY < 400 ? 'transform' : 'auto',
        }}
      >
        <h1 className="text-3xl md:text-6xl font-serif font-bold animate-fade-in drop-shadow-lg">
          Continue your lifelong journey.
        </h1>
        <p className="mt-4 text-base md:text-xl max-w-2xl animate-fade-in animation-delay-300 drop-shadow-md">
          Build connections, explore resources, and find new opportunities.
        </p>
      </div>
    </div>
  );
};

export default Hero;
