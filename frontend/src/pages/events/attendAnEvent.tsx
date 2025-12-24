import { useState } from 'react';
import { Calendar, Users, Clock, Trophy, Sparkles, Lock, ArrowRight, ChevronRight, PartyPopper, GraduationCap, Briefcase, Heart, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventType {
  icon: any;
  title: string;
  description: string;
  color: string;
  examples: string[];
}

interface Benefit {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}

const AttendAnEvent = () => {
  const [hoveredType, setHoveredType] = useState<number | null>(null);

  const eventTypes: EventType[] = [
    {
      icon: Briefcase,
      title: 'Professional Seminars & Webinars',
      description: 'Alumni host expert-led seminars and webinars on industry trends, career development, and specialized skills.',
      color: 'from-blue-500 to-blue-600',
      examples: [
        'Industry insights and emerging trends',
        'Career advancement strategies',
        'Technical skill development sessions',
        'Leadership and management workshops',
        'Startup and entrepreneurship talks'
      ]
    },
    {
      icon: Users,
      title: 'Networking Meetups',
      description: 'Connect with fellow alumni and students through casual meetups, coffee sessions, and networking gatherings.',
      color: 'from-purple-500 to-purple-600',
      examples: [
        'City-based alumni meetups',
        'Industry-specific networking events',
        'Informal coffee and conversation sessions',
        'Speed networking rounds',
        'Alumni-student mixer events'
      ]
    },
    {
      icon: GraduationCap,
      title: 'Knowledge Sharing Sessions',
      description: 'Alumni share their expertise through talks, panel discussions, and interactive Q&A sessions with students and fellow alumni.',
      color: 'from-amber-500 to-amber-600',
      examples: [
        'Career guidance panels',
        'Technical deep-dive sessions',
        'Research and innovation showcases',
        'Interview preparation workshops',
        'Real-world case study discussions'
      ]
    },
    {
      icon: Heart,
      title: 'Community & Social Events',
      description: 'Build connections beyond work through social gatherings, hobby clubs, sports events, and celebration meetups.',
      color: 'from-green-500 to-green-600',
      examples: [
        'Sports tournaments and fitness groups',
        'Cultural celebration gatherings',
        'Hobby and interest-based clubs',
        'Batch reunion celebrations',
        'Community service initiatives'
      ]
    }
  ];

  const benefits: Benefit[] = [
    {
      icon: PartyPopper,
      title: 'Host Your Own Events',
      description: 'Create and organize seminars, webinars, meetups, or social gatherings and share them with the entire NSUT community.',
      gradient: 'bg-blue-50'
    },
    {
      icon: Users,
      title: 'Participate & Connect',
      description: 'Browse and join events hosted by fellow alumni. RSVP easily and connect with like-minded NSUTians.',
      gradient: 'bg-purple-50'
    },
    {
      icon: Trophy,
      title: 'Learn & Share Knowledge',
      description: 'Attend professional sessions, gain industry insights, and share your expertise with students and alumni.',
      gradient: 'bg-amber-50'
    },
    {
      icon: Sparkles,
      title: 'Student Participation',
      description: 'Students can join alumni-hosted events to learn, network, and gain valuable real-world insights.',
      gradient: 'bg-green-50'
    }
  ];

  const upcomingHighlights = [
    { title: 'Alumni-Hosted Webinars', frequency: 'Weekly' },
    { title: 'City-Based Meetups', frequency: 'Ongoing' },
    { title: 'Career Guidance Sessions', frequency: 'Bi-Weekly' },
    { title: 'Technical Workshops', frequency: 'Monthly' },
    { title: 'Networking Events', frequency: 'Ongoing' },
    { title: 'Social & Cultural Gatherings', frequency: 'Regular' }
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
            <Calendar className="w-12 h-12 text-nsut-yellow" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Attend an Event
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            Discover Alumni-Hosted Events & Meetups
          </p>
          <p className="text-lg max-w-5xl mt-6 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            Our platform empowers alumni to host and share events with the NSUT community. Whether you want to organize a seminar, webinar, networking meetup, or social gathering, you can create and promote your events here. Alumni and students alike can discover, RSVP, and participate in events hosted by fellow NSUTians across the globe.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        
        {/* Benefits of Attending */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            How Our Event Platform Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            A community-driven platform where alumni host events and everyone can participate
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
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

        {/* Login CTA Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-2xl shadow-2xl p-12 text-white relative overflow-hidden animate-fade-in">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <Lock className="w-16 h-16 text-nsut-yellow mx-auto mb-6" />
              <h2 className="font-serif text-4xl font-bold mb-4">
                Login to Explore & Host Events
              </h2>
              <p className="text-xl mb-8 leading-relaxed opacity-95">
                Browse events hosted by fellow alumni, RSVP to participate, or create your own events to share with the community. Students and alumni are welcome to join!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/login"
                  className="group bg-nsut-yellow hover:bg-nsut-yellow/90 text-nsut-maroon px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Login to View Events
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
                Already a member? Login to explore all upcoming events!
              </p>
            </div>
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Events Alumni Can Host
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Alumni create and host various types of events on our platform - from professional seminars to casual meetups, there's something for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {eventTypes.map((type, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredType(index)}
                onMouseLeave={() => setHoveredType(null)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${type.color}`}></div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-grow">
                      <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {type.description}
                      </p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 ml-4`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Examples List */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Event Examples:</p>
                    {type.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 transition-all duration-300 ${
                          hoveredType === index ? 'translate-x-2 bg-nsut-beige/30' : ''
                        }`}
                      >
                        <ChevronRight className={`w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5 ${
                          hoveredType === index ? 'text-nsut-maroon' : ''
                        } transition-colors`} />
                        <span className="text-gray-700 leading-relaxed text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Frequency Overview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Popular Event Categories
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Alumni regularly host various types of events - explore what's happening in the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingHighlights.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-1"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <h3 className="font-serif text-lg font-bold text-nsut-maroon mb-2 group-hover:text-[#800000] transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-nsut-yellow" />
                      <span>{item.frequency}</span>
                    </div>
                  </div>
                  <PartyPopper className="w-8 h-8 text-nsut-yellow group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-nsut-beige to-nsut-beige/50 rounded-2xl p-12 border border-nsut-yellow/30">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-nsut-maroon mb-4">
              Ready to Host or Join Events?
            </h2>
            <p className="text-gray-700 text-lg mb-8 max-w-3xl mx-auto">
              Login to browse alumni-hosted events, RSVP to participate, or create your own event to share with the community. Students and alumni welcome!
            </p>
            <Link 
              to="/login"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-nsut-maroon to-[#800000] hover:from-[#800000] hover:to-nsut-maroon text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendAnEvent;
