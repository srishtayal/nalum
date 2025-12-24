import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Users, Heart, Target, Award, Linkedin, Building2, GraduationCap } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// ============================================
// TEAM MEMBERS CONFIGURATION
// ============================================
// Add team member photos in the public folder at these paths:
// For Faculty: /about/team/faculty/[name].jpg
// For Students: /about/team/students/[name].jpg

interface TeamMember {
  name: string;
  role?: string;
  image: string;
}

const facultyMembers: TeamMember[] = [
  {
    name: 'Prof. Anand Srivastava',
    role: 'Vice Chancellor, NSUT',
    image: '/about/team/faculty/prof-anand-srivastava.jpg'
  },
  {
    name: 'Faculty Advisor 1',
    role: 'Professor, Department',
    image: '/about/team/faculty/faculty-1.jpg'
  },
  {
    name: 'Faculty Advisor 2',
    role: 'Professor, Department',
    image: '/about/team/faculty/faculty-2.jpg'
  },
  {
    name: 'Faculty Advisor 3',
    role: 'Professor, Department',
    image: '/about/team/faculty/faculty-3.jpg'
  }
  // Add more faculty members here
];

const studentMembers: TeamMember[] = [
  {
    name: 'Student Lead 1',
    role: 'President',
    image: '/about/team/students/student-1.jpg'
  },
  {
    name: 'Student Lead 2',
    role: 'Vice President',
    image: '/about/team/students/student-2.jpg'
  },
  {
    name: 'Student Member 3',
    role: 'Technical Head',
    image: '/about/team/students/student-3.jpg'
  },
  {
    name: 'Student Member 4',
    role: 'Events Coordinator',
    image: '/about/team/students/student-4.jpg'
  },
  {
    name: 'Student Member 5',
    role: 'Marketing Head',
    image: '/about/team/students/student-5.jpg'
  },
  {
    name: 'Student Member 6',
    role: 'Content Writer',
    image: '/about/team/students/student-6.jpg'
  }
  // Add more student members here
];
// ============================================

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'team'>('about');
  const location = useLocation();

  // Scroll to hash anchor when component mounts or hash changes
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        const yOffset = -100; // Offset for fixed header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }, [location]);

  const values = [
    {
      icon: Heart,
      title: 'Community Building',
      description: 'Fostering lifelong connections among NSUT alumni across generations and geographies.'
    },
    {
      icon: Target,
      title: 'Professional Growth',
      description: 'Supporting career development through mentorship, networking, and industry collaboration.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Maintaining the highest standards in alumni engagement and institutional support.'
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Creating an inclusive environment that welcomes all alumni regardless of batch or background.'
    }
  ];

  const initiatives = [
    'Alumni networking events and reunions',
    'Mentorship programs connecting students with alumni',
    'Career guidance and placement support',
    'Industry-academia collaboration initiatives',
    'Alumni database and directory management',
    'Regular newsletters and communication',
    'Support for entrepreneurship and startups',
    'Recognition of notable alumni achievements'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-nsut-beige/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-nsut-maroon to-[#800000] text-white py-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center gap-4 mb-6 animate-fade-in">
            <Building2 className="w-12 h-12 text-nsut-yellow" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              About NALUM
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            NSUT Alumni Affairs Team
          </p>
          <p className="text-lg max-w-5xl mt-4 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            Connecting generations, fostering excellence, and building a vibrant global community of NSUT alumni
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Tabs */}
        <div className="mb-12">
          <div className="flex justify-center gap-4 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-8 py-4 font-serif text-xl font-bold transition-all duration-300 relative ${
                activeTab === 'about'
                  ? 'text-nsut-maroon'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              About Us
              {activeTab === 'about' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nsut-maroon to-nsut-yellow"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-8 py-4 font-serif text-xl font-bold transition-all duration-300 relative ${
                activeTab === 'team'
                  ? 'text-nsut-maroon'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Our Team
              {activeTab === 'team' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nsut-maroon to-nsut-yellow"></div>
              )}
            </button>
          </div>
        </div>

        {/* About Us Tab */}
        {activeTab === 'about' && (
          <div className="animate-fade-in">
            {/* Mission Statement */}
            <div className="mb-16">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-6 text-center">
                  Who We Are
                </h2>
                <div className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p>
                    The NSUT Alumni Affairs Team (NALUM) serves as the official bridge connecting past, present, and future generations of Netaji Subhas University of Technology. We are dedicated to fostering a vibrant, engaged, and supportive community of alumni who continue to contribute to the university's legacy and each other's success.
                  </p>
                  <p>
                    Established to strengthen the bond between the university and its graduates, NALUM works tirelessly to create opportunities for networking, mentorship, professional development, and lifelong learning. We believe that the relationship between NSUT and its alumni extends far beyond graduation—it's a lifelong partnership built on shared values, memories, and aspirations.
                  </p>
                  <p className="font-semibold text-nsut-maroon">
                    Our mission is to cultivate meaningful connections, facilitate professional growth, and celebrate the achievements of NSUT alumni while supporting current students in their academic and career journeys.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values */}
            <div className="mb-16">
              <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-12 text-center">
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* What We Do */}
            <div className="mb-16">
              <div className="bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-2xl p-8 md:p-12 text-white shadow-xl">
                <h2 className="font-serif text-4xl font-bold mb-6 flex items-center gap-3">
                  <Target className="w-10 h-10 text-nsut-yellow" />
                  What We Do
                </h2>
                <p className="text-lg mb-8 opacity-95 leading-relaxed">
                  NALUM coordinates a wide range of initiatives designed to keep alumni connected, engaged, and supported throughout their professional journeys.
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

            {/* Contact Information */}
            <div className="mb-8" id="contact">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-8 text-center">
                  Get in Touch
                </h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Email */}
                  <div className="group flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-nsut-beige/30 to-white hover:from-nsut-beige/50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-nsut-yellow/50 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-nsut-maroon mb-2">Email Us</h3>
                      <a href="mailto:alumni@nsut.ac.in" className="text-gray-700 hover:text-nsut-maroon transition-colors">
                        alumni@nsut.ac.in
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-nsut-beige/30 to-white hover:from-nsut-beige/50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-nsut-yellow/50 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-nsut-maroon mb-2">Call Us</h3>
                      <a href="tel:+911125000000" className="text-gray-700 hover:text-nsut-maroon transition-colors">
                        +91 11 2500 0000
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="group flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-nsut-beige/30 to-white hover:from-nsut-beige/50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-nsut-yellow/50 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-nsut-maroon mb-2">Visit Us</h3>
                      <p className="text-gray-700">
                        Netaji Subhas University of Technology<br />
                        Azad Hind Fauj Marg, Sector 3<br />
                        Dwarka, New Delhi - 110078
                      </p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="group flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r from-nsut-beige/30 to-white hover:from-nsut-beige/50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-nsut-yellow/50 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-nsut-maroon mb-2">Connect on LinkedIn</h3>
                      <a
                        href="https://www.linkedin.com/school/nsut-delhi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-nsut-maroon transition-colors"
                      >
                        NSUT Alumni Network
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Our Team Tab */}
        {activeTab === 'team' && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-12 text-center">
              Meet Our Team
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Faculty Advisors - Left Side */}
              <div>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-nsut-maroon to-[#800000] text-white rounded-full shadow-lg">
                    <GraduationCap className="w-6 h-6" />
                    <h3 className="font-serif text-2xl font-bold">Faculty Advisors</h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {facultyMembers.map((member, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-nsut-maroon to-nsut-yellow flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                          {/* Placeholder - Replace with actual image */}
                          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-br from-nsut-maroon to-nsut-yellow">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          {/* When you add actual images, uncomment this:
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          */}
                        </div>
                        
                        {/* Member Info */}
                        <div className="flex-grow">
                          <h4 className="font-serif text-xl font-bold text-nsut-maroon mb-1 group-hover:text-[#800000] transition-colors">
                            {member.name}
                          </h4>
                          {member.role && (
                            <p className="text-gray-600 text-sm">{member.role}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Team - Right Side */}
              <div>
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-lg">
                    <Users className="w-6 h-6" />
                    <h3 className="font-serif text-2xl font-bold">Student Team</h3>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {studentMembers.map((member, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-gray-100 hover:border-purple-300 animate-fade-in hover:-translate-y-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                          {/* Placeholder - Replace with actual image */}
                          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-br from-purple-500 to-purple-700">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          {/* When you add actual images, uncomment this:
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          */}
                        </div>
                        
                        {/* Member Info */}
                        <div className="flex-grow">
                          <h4 className="font-serif text-xl font-bold text-nsut-maroon mb-1 group-hover:text-purple-700 transition-colors">
                            {member.name}
                          </h4>
                          {member.role && (
                            <p className="text-gray-600 text-sm">{member.role}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Note */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm italic">
                Note: Add team member photos at /about/team/faculty/ and /about/team/students/ paths
              </p>
            </div>
          </div>
        )}
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

export default AboutPage;
