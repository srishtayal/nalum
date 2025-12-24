import { useState } from 'react';
import { Users, Search, MapPin, Briefcase, GraduationCap, Network, Globe, MessageSquare, Calendar, Building2, Award, TrendingUp, Lock, ArrowRight, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface Benefit {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}

const AlumniDirectoryHome = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const directoryFeatures: Feature[] = [
    {
      icon: Search,
      title: 'Advanced Search & Filters',
      description: 'Find alumni by name, graduation year, department, company, location, or industry. Use powerful filters to discover exactly who you\'re looking for.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPin,
      title: 'Geographic Distribution',
      description: 'Explore our global alumni network spread across continents. Discover NSUT alumni in your city or country and connect with local communities.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Briefcase,
      title: 'Professional Insights',
      description: 'Access detailed professional profiles including current roles, companies, industries, and career trajectories of fellow alumni.',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: GraduationCap,
      title: 'Academic Background',
      description: 'View graduation years, departments, degrees, and academic achievements. Connect with alumni from your batch or department.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const connectionBenefits: Benefit[] = [
    {
      icon: Network,
      title: 'Professional Networking',
      description: 'Build meaningful connections with alumni across industries, from startups to Fortune 500 companies.',
      gradient: 'bg-blue-50'
    },
    {
      icon: MessageSquare,
      title: 'Mentorship Opportunities',
      description: 'Find mentors or become one. Share experiences, guidance, and career advice with fellow NSUTians.',
      gradient: 'bg-purple-50'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Join a vibrant community of NSUT alumni spanning 50+ countries and hundreds of cities worldwide.',
      gradient: 'bg-amber-50'
    },
    {
      icon: Award,
      title: 'Career Growth',
      description: 'Discover job opportunities, industry insights, and career pathways through alumni connections.',
      gradient: 'bg-green-50'
    }
  ];

  const searchCapabilities = [
    { label: 'Search by Name or Email', icon: Search },
    { label: 'Filter by Graduation Year (1950-2025)', icon: Calendar },
    { label: 'Filter by Department & Program', icon: GraduationCap },
    { label: 'Filter by Current Company', icon: Building2 },
    { label: 'Filter by Industry Sector', icon: Briefcase },
    { label: 'Filter by Location & Country', icon: MapPin },
    { label: 'Advanced Multi-Filter Combinations', icon: Filter },
    { label: 'Real-time Search Results', icon: TrendingUp }
  ];

  const stats = [
    { number: '15,000+', label: 'Alumni Profiles' },
    { number: '50+', label: 'Countries' },
    { number: '500+', label: 'Cities' },
    { number: '100+', label: 'Industries' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-nsut-beige/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-nsut-maroon to-[#800000] text-white py-20 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
            <Users className="w-12 h-12 text-nsut-yellow" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Alumni Directory
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            Connect with 15,000+ NSUT Alumni Worldwide
          </p>
          <p className="text-lg max-w-5xl mt-4 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            The NSUT Alumni Directory is your gateway to connecting with fellow NSUTians across the globe. Discover alumni working at leading organizations, find mentors, explore career opportunities, and strengthen the bonds of our vibrant community.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animation-delay-700 animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-nsut-yellow mb-1">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        
        {/* Login CTA Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-2xl shadow-2xl p-12 text-white relative overflow-hidden animate-fade-in">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <Lock className="w-16 h-16 text-nsut-yellow mx-auto mb-6" />
              <h2 className="font-serif text-4xl font-bold mb-4">
                Access the Full Alumni Directory
              </h2>
              <p className="text-xl mb-8 leading-relaxed opacity-95">
                To search and connect with fellow NSUT alumni, you need to be logged into your account. Join our thriving community today!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/login"
                  className="group bg-nsut-yellow hover:bg-nsut-yellow/90 text-nsut-maroon px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Login to Access Directory
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/signup"
                  className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <p className="mt-6 text-sm opacity-80">
                Already a member? Simply login to start exploring!
              </p>
            </div>
          </div>
        </div>

        {/* Directory Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Powerful Directory Features
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Our comprehensive alumni directory offers advanced tools to help you find and connect with the right people
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {directoryFeatures.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Capabilities */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Advanced Search Capabilities
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Find exactly who you're looking for with our powerful search and filtering system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchCapabilities.map((capability, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <capability.icon className="w-8 h-8 text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors" />
                <p className="text-gray-700 font-medium leading-relaxed text-sm">
                  {capability.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Benefits */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            Why Connect with Alumni?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            Connecting with fellow NSUT alumni opens doors to countless opportunities and strengthens our community
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {connectionBenefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              How to Use the Directory
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Getting started is simple and takes just a few minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Login or Create Account',
                description: 'Sign in with your NSUT credentials or create a new alumni account to get started.',
                icon: Lock
              },
              {
                step: '2',
                title: 'Search & Filter',
                description: 'Use advanced search and filters to find alumni by name, year, department, company, or location.',
                icon: Search
              },
              {
                step: '3',
                title: 'Connect & Network',
                description: 'View detailed profiles, send connection requests, and start building your professional network.',
                icon: Network
              }
            ].map((step, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-nsut-yellow/50 transition-all duration-300 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>

                <div className="mt-4">
                  <step.icon className="w-12 h-12 text-nsut-maroon mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-nsut-yellow" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-nsut-beige to-nsut-beige/50 rounded-2xl p-12 border border-nsut-yellow/30">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-nsut-maroon mb-4">
              Ready to Connect with Fellow NSUTians?
            </h2>
            <p className="text-gray-700 text-lg mb-8 max-w-3xl mx-auto">
              Join thousands of alumni who are already networking, mentoring, and growing together through our alumni directory.
            </p>
            <Link 
              to="/login"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-nsut-maroon to-[#800000] hover:from-[#800000] hover:to-nsut-maroon text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Access Alumni Directory Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlumniDirectoryHome;
