import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

const Hero = () => {
  // Default main image
  const defaultImage = '/src/assets/nsut-campus-hero.png';
  
  // Slideshow images from public/homeGallery folder
  const images = [
    '/homeGallery/Om (2).JPG',
    '/homeGallery/Om (5).JPG',
    '/homeGallery/Om (10).JPG',
    '/homeGallery/Om (15).JPG',
    '/homeGallery/raxt-1.JPG',
    '/homeGallery/Raxt-8.JPG',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Slideshow logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
          setIsTransitioning(false);
        }, 500); // Half of transition duration
      }, 4000); // Change image every 4 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, images.length]);

  // Toggle play/pause and show default image when stopped
  const toggleSlideshow = () => {
    if (isPlaying) {
      // Stopping - fade to default main image
      setIsPlaying(false);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(-1); // Use -1 to indicate default image
        setIsTransitioning(false);
      }, 500);
    } else {
      // Starting - begin from first slideshow image
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(0);
        setIsPlaying(true);
        setIsTransitioning(false);
      }, 500);
    }
  };

  return (
    <div 
      ref={heroRef}
      className="relative h-screen bg-cover bg-center text-white overflow-hidden"
    >
      {/* Background Images with crossfade */}
      <div className="absolute inset-0">
        {/* Default main image - shown when paused */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            currentImageIndex === -1 && !isTransitioning
              ? 'opacity-100'
              : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${defaultImage}')` }}
        />
        
        {/* Slideshow images */}
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex && !isTransitioning
                ? 'opacity-100'
                : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Play/Pause Button */}
      <button
        onClick={toggleSlideshow}
        className="absolute top-24 right-8 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-white group-hover:text-nsut-yellow transition-colors" />
        ) : (
          <Play className="w-6 h-6 text-white group-hover:text-nsut-yellow transition-colors" />
        )}
      </button>

      {/* Slideshow indicators - only show when playing */}
      {isPlaying && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentImageIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content with scroll animation */}
      <div
  className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 transition-transform duration-100 ease-out"
  style={{
    transform: `translateY(${Math.min(scrollY * 0.5, 300)}px)`, // Limit to 200px shift
  }}
>
  <h1 className="text-4xl md:text-6xl font-serif font-bold animate-fade-in">
    Continue your lifelong journey.
  </h1>
  <p className="mt-4 text-lg md:text-xl max-w-2xl animate-fade-in animation-delay-300">
    Build connections, explore resources, and find new opportunities.
  </p>
</div>

    </div>
  );
};

export default Hero;
