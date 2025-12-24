import { useState } from 'react';
import { Users, MessageSquare, Calendar, Network, Search, Send, Video, Globe, Lock, ArrowRight, ChevronRight, Heart, Sparkles, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
  benefits: string[];
}

interface CommunityAspect {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}

const ExploreCommunities = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const communityFeatures: Feature[] = [
    {
      icon: MessageSquare,
      title: 'Chat & Messaging System',
      description: 'Connect instantly with fellow alumni through our integrated messaging platform. Send direct messages, share updates, and build meaningful conversations.',
      color: 'from-blue-500 to-blue-600',
      benefits: [
        'One-on-one direct messaging with alumni',
        'Real-time chat conversations',
        'Share ideas, advice, and opportunities',
        'Build professional and personal connections',
        'Stay in touch with batchmates and colleagues'
      ]
    },
    {
      icon: Calendar,
      title: 'Community Events',
      description: 'Participate in alumni-hosted events including seminars, webinars, meetups, and social gatherings happening across the globe.',
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'Join webinars and professional workshops',
        'Attend city-based alumni meetups',
        'Participate in networking sessions',
        'Engage in knowledge-sharing events',
        'Connect at social and cultural gatherings'
      ]
    },
    {
      icon: Search,
      title: 'Alumni Directory',
      description: 'Discover and connect with 15,000+ NSUT alumni worldwide through our comprehensive searchable directory.',
      color: 'from-amber-500 to-amber-600',
      benefits: [
        'Search alumni by name, batch, or location',
        'Filter by industry, company, or department',
        'View detailed professional profiles',
        'Send connection requests',
        'Build your professional network'
      ]
    },
    {
      icon: Network,
      title: 'Connection Network',
      description: 'Build and manage your alumni connections, send requests, accept invitations, and grow your NSUT network organically.',
      color: 'from-green-500 to-green-600',
      benefits: [
        'Send and receive connection requests',
        'Manage your alumni connections',
        'Discover mutual connections',
        'Expand your professional circle',
        'Stay updated with your network'
      ]
    }
  ];

  const communityAspects: CommunityAspect[] = [
    {
      icon: Users,
      title: 'Global Network',
      description: 'Connect with alumni spanning 50+ countries and hundreds of cities worldwide.',
      gradient: 'bg-blue-50'
    },
    {
      icon: Heart,
      title: 'Meaningful Connections',
      description: 'Build lasting relationships with fellow NSUTians who share your background and values.',
      gradient: 'bg-purple-50'
    },
    {
      icon: Sparkles,
      title: 'Shared Experiences',
      description: 'Bond over shared memories, experiences, and the unique NSUT journey that connects us all.',
      gradient: 'bg-amber-50'
    },
    {
      icon: Globe,
      title: 'Diverse Community',
      description: 'Engage with alumni across industries, roles, locations, and graduation years.',
      gradient: 'bg-green-50'
    }
  ];

  const connectionWays = [
    { icon: MessageSquare, title: 'Direct Messaging', description: 'Chat one-on-one with any alumni' },
    { icon: UserPlus, title: 'Connection Requests', description: 'Build your network strategically' },
    { icon: Calendar, title: 'Event Participation', description: 'Meet alumni at events and meetups' },
    { icon: Video, title: 'Virtual Meetups', description: 'Join online webinars and sessions' },
    { icon: Send, title: 'Share & Collaborate', description: 'Exchange ideas and opportunities' },
    { icon: Network, title: 'Group Discussions', description: 'Engage in community conversations' }
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
              Explore Communities
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            Connect, Collaborate, and Grow Together
          </p>
          <p className="text-lg max-w-5xl mt-6 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            The NSUT Alumni community is a vibrant network of over 15,000 graduates spread across the globe. Our platform brings this community together through powerful tools for connection, communication, and collaboration. Whether you're looking to reconnect with old friends, seek career guidance, or give back to fellow alumni, you'll find a welcoming and engaged community here.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        
        {/* Community Aspects */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            What Makes Our Community Special
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            More than just a network - a family of NSUTians supporting each other across the world
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityAspects.map((aspect, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <aspect.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                  {aspect.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {aspect.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Login CTA Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-2xl shadow-2xl p-12 text-white relative overflow-hidden animate-fade-in">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <Lock className="w-16 h-16 text-nsut-yellow mx-auto mb-6" />
              <h2 className="font-serif text-4xl font-bold mb-4">
                Login to Access Community Features
              </h2>
              <p className="text-xl mb-8 leading-relaxed opacity-95">
                Join the conversation, connect with alumni, participate in events, and become an active member of the NSUT community!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/login"
                  className="group bg-nsut-yellow hover:bg-nsut-yellow/90 text-nsut-maroon px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Login to Connect
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
                Already a member? Login to start connecting today!
              </p>
            </div>
          </div>
        </div>

        {/* Community Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Ways to Connect & Engage
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Our platform offers multiple tools and features to help you build meaningful connections with the alumni community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {communityFeatures.map((feature, index) => (
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
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-grow">
                      <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 ml-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Key Features:</p>
                    {feature.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 transition-all duration-300 ${
                          hoveredFeature === index ? 'translate-x-2 bg-nsut-beige/30' : ''
                        }`}
                      >
                        <ChevronRight className={`w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5 ${
                          hoveredFeature === index ? 'text-nsut-maroon' : ''
                        } transition-colors`} />
                        <span className="text-gray-700 leading-relaxed text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Methods */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Multiple Ways to Connect
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Choose how you want to engage with the community based on your interests and availability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectionWays.map((way, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-1"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <way.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-lg font-bold text-nsut-maroon mb-2 group-hover:text-[#800000] transition-colors">
                      {way.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {way.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-nsut-maroon to-[#800000] rounded-2xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Ready to Join the Community?
              </h2>
              <p className="text-lg mb-8 max-w-3xl mx-auto opacity-95">
                Login now to start connecting with fellow alumni, participate in events, and become part of our vibrant community.
              </p>
              <Link 
                to="/login"
                className="group inline-flex items-center gap-2 bg-nsut-yellow hover:bg-nsut-yellow/90 text-nsut-maroon px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Connecting Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExploreCommunities;
