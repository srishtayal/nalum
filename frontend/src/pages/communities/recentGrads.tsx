import { useState, useEffect } from 'react';
import { GraduationCap, ChevronLeft, ChevronRight, Users, Award, Globe, Lightbulb, Target, Building2, TrendingUp, Heart, Sparkles } from 'lucide-react';

// ============================================
// IMAGE CONFIGURATION
// ============================================
// Add your convocation ceremony images here
// Recommended: High-quality images from the convocation ceremony
// Format: JPG or PNG, Size: ~1920x1080 or similar aspect ratio
const carouselImages = [
  {
    src: '/Communities/RecentGrads/convocation-1.jpg', // Replace with actual convocation ceremony images
    alt: 'NSUT Third Convocation Ceremony at Yashobhoomi Convention Centre',
    caption: 'Third Convocation - Class of 2025'
  },
  {
    src: '/Communities/RecentGrads/convocation-2.jpg', // Replace with actual convocation ceremony images
    alt: 'Graduating students receiving their degrees',
    caption: '2,450 Graduates Across All Programs'
  },
  {
    src: '/Communities/RecentGrads/convocation-3.jpg', // Replace with actual convocation ceremony images
    alt: 'Distinguished guests and university leadership',
    caption: 'Honoured by Distinguished Leadership'
  },
  {
    src: '/Communities/RecentGrads/convocation-4.jpg', // Replace with actual convocation ceremony images
    alt: 'Gold medalists and PhD awardees',
    caption: 'Celebrating Academic Excellence'
  },
  {
    src: '/Communities/RecentGrads/convocation-5.jpg', // Replace with actual convocation ceremony images
    alt: 'Students taking the convocation pledge',
    caption: 'A Shared Pledge for the Future'
  }
];
// ============================================

const RecentGradsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const distinguishedGuests = [
    {
      title: 'Hon\'ble Chancellor',
      name: 'Shri Vinai Kumar Saxena',
      designation: 'Lieutenant Governor of Delhi',
      icon: Award
    },
    {
      title: 'Hon\'ble Chief Minister',
      name: 'Smt. Rekha Gupta',
      designation: 'Chief Minister of Delhi',
      icon: Users
    },
    {
      title: 'Hon\'ble Minister of Education',
      name: 'Shri Ashish Sood',
      designation: 'Minister of Education',
      icon: GraduationCap
    },
    {
      title: 'Chief Guest',
      name: 'Shri Sanjay Gupta',
      designation: 'President, Google APAC',
      icon: Globe
    }
  ];

  const keyThemes = [
    {
      icon: Lightbulb,
      title: 'Engineering for Sustainable Development',
      speaker: 'Prof. Anand Srivastava, Vice Chancellor',
      message: 'Innovation that balances ambition with ethics, progress with responsibility, and technical excellence with social awareness.'
    },
    {
      icon: Target,
      title: 'Holistic and Multidisciplinary Education',
      speaker: 'Hon\'ble Chief Minister Smt. Rekha Gupta',
      message: 'Apply knowledge toward addressing climate change, urban development, and digital equity aligned with NEP 2020.'
    },
    {
      icon: TrendingUp,
      title: 'Technology with Sustainability',
      speaker: 'Hon\'ble Chancellor Shri Vinai Kumar Saxena',
      message: 'Technological advancement must move in harmony with sustainability, inclusivity, and greater representation of women in STEM.'
    },
    {
      icon: Heart,
      title: 'Innovation Guided by Purpose',
      speaker: 'Shri Sanjay Gupta, President, Google APAC',
      message: 'Innovation guided by purpose, empathy, and long-term impact, with continued support for research internships at NSUT.'
    }
  ];

  const milestones = [
    { icon: Users, stat: '2,450', label: 'Graduates', color: 'from-blue-500 to-blue-600' },
    { icon: Award, stat: 'Multiple', label: 'Gold Medalists', color: 'from-amber-500 to-amber-600' },
    { icon: GraduationCap, stat: 'Ph.D.', label: 'Awardees', color: 'from-purple-500 to-purple-600' },
    { icon: Building2, stat: '3rd', label: 'Convocation', color: 'from-green-500 to-green-600' }
  ];

  const initiatives = [
    'Unveiling of Statue of Netaji Subhas Chandra Bose at East and West Campuses',
    'Inauguration of Skill Centre at East Campus',
    'Inauguration of Centre of Excellence in Industry 4.0 at West Campus',
    "Google's continued support for research internships",
    'Faculty development and STEM-focused learning initiatives',
    'Digital empowerment and industry-academia collaboration'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-nsut-beige/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-nsut-maroon to-[#800000] text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
            <GraduationCap className="w-12 h-12 text-nsut-yellow" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Recent Graduates
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            Convocation 2025 - A Milestone Moment
          </p>
          <p className="text-lg max-w-5xl mt-4 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            Welcoming the Class of 2025 into a Global Community of NSUT Alumni
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        
        {/* Opening Quote */}
        <div className="mb-16 text-center animate-fade-in">
          <blockquote className="text-2xl md:text-3xl font-serif italic text-nsut-maroon max-w-4xl mx-auto leading-relaxed">
            "The class of 2025 joins a growing global community bound not only by degrees, but by shared values and collective ambitions."
          </blockquote>
        </div>

        {/* Carousel Section */}
        <div className="mb-20">
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in">
            {/* Carousel Images */}
            <div className="relative h-[400px] md:h-[600px] overflow-hidden">
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full bg-gradient-to-br from-nsut-maroon via-[#800000] to-nsut-yellow flex items-center justify-center';
                      fallback.innerHTML = `
                        <div class="text-center text-white p-8">
                          <p class="text-xl font-semibold mb-2">${image.alt}</p>
                          <p class="text-sm opacity-75">Image not found at: ${image.src}</p>
                        </div>
                      `;
                      target.parentElement?.appendChild(fallback);
                    }}
                  />
                  
                  {/* Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                    <p className="text-white text-xl md:text-2xl font-serif font-bold">
                      {image.caption}
                    </p>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-nsut-maroon shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-nsut-maroon shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-10">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-nsut-yellow'
                      : 'w-2 h-2 bg-white/60 hover:bg-white/90'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Carousel Info */}
          <p className="text-center text-gray-500 mt-4 text-sm">
            Third Convocation of NSUT held at Yashobhoomi Convention Centre
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-20 animate-fade-in">
          <p className="text-gray-700 text-lg leading-relaxed max-w-5xl mx-auto">
            Netaji Subhas University of Technology (NSUT) marked a significant milestone in its academic journey with the Third Convocation Ceremony, held at the Yashobhoomi Convention Centre. More than a ceremonial tradition, the convocation symbolized transition—signifying the moment when years of learning, discipline, and growth culminated in a lifelong association with the university. The occasion brought together university leadership, distinguished guests, faculty members, alumni, graduating students, and their families in an atmosphere of pride, reflection, and forward-looking optimism.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 text-center border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <milestone.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl font-bold text-nsut-maroon mb-2">{milestone.stat}</p>
                <p className="text-gray-600 font-medium">{milestone.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Distinguished Guests */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            An Occasion Honoured by Distinguished Leadership
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            The ceremony was graced by the presence of distinguished leaders, underscoring NSUT's growing stature as an institution that actively engages with governance, education, and industry.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distinguishedGuests.map((guest, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <guest.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{guest.title}</p>
                <h3 className="font-serif text-lg font-bold text-nsut-maroon mb-1 group-hover:text-[#800000] transition-colors">
                  {guest.name}
                </h3>
                <p className="text-sm text-gray-600">{guest.designation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Themes */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            Ideas and Values That Shaped the Ceremony
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            Distinguished speakers shared their vision for the future, emphasizing values of innovation, sustainability, and social responsibility.
          </p>

          <div className="space-y-6">
            {keyThemes.map((theme, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <theme.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-2 group-hover:text-[#800000] transition-colors">
                      {theme.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 italic">— {theme.speaker}</p>
                    <p className="text-gray-700 leading-relaxed">
                      {theme.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Milestones */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="font-serif text-4xl font-bold mb-6 flex items-center gap-3">
              <Building2 className="w-10 h-10 text-nsut-yellow" />
              Institutional Milestones and Future-Ready Initiatives
            </h2>
            <p className="text-lg mb-8 opacity-95 leading-relaxed">
              The convocation also served as a platform to mark significant institutional developments, reflecting NSUT's sustained commitment to academic advancement, research excellence, and skill-oriented education aligned with emerging industry needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initiatives.map((initiative, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 animate-fade-in border border-white/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 bg-nsut-yellow rounded-full mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed">{initiative}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alumni Message */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-nsut-beige/40 via-white to-nsut-beige/40 rounded-2xl p-8 md:p-12 border-2 border-nsut-yellow/30 shadow-xl">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 flex items-center justify-center gap-3">
                  <Heart className="w-10 h-10 text-nsut-yellow" />
                  A Message from NALUM
                </h2>
                <p className="text-xl font-serif italic text-gray-700">
                  "Convocation is not an end, but a beginning where learning transforms into responsibility and purpose."
                </p>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  The Third Convocation represents a proud moment of continuity, linking generations of graduates through shared experiences, values, and aspirations. The NSUT Alumni Affairs Team remains committed to fostering meaningful engagement across batches and geographies, strengthening mentorship, collaboration, and lifelong association with the university.
                </p>
                <p className="font-semibold text-nsut-maroon">
                  We warmly welcome the Class of 2025 and look forward to their active participation in shaping and advancing the enduring legacy of NSUT.
                </p>
                <p className="text-right italic text-gray-600 mt-6">
                  — NSUT Alumni Affairs Team (NALUM)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-6 text-center">
            Why This Convocation Matters to the Alumni Community
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>
              The Third Convocation was not only a celebration for graduating students, but a moment of reflection for the wider alumni community. Each convocation strengthens the continuum between past and present batches, reinforcing shared traditions while welcoming fresh perspectives into the NSUT alumni network.
            </p>
            <p>
              The Class of 2025 now carries forward this evolving legacy, adding new chapters through their professional journeys, innovations, and contributions to society. The ceremony concluded with the Convocation Pledge, reaffirming the university's confidence in its graduates to lead with integrity, responsibility, and social consciousness.
            </p>
            <p className="font-semibold text-nsut-maroon">
              As the Class of 2025 steps forward as members of the NSUT alumni community, they carry with them not only academic credentials, but also the values, traditions, and collective spirit that define the university's legacy.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
};

export default RecentGradsPage;
