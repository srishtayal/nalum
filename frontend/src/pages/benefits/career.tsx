import { useState } from 'react';
import { Briefcase, TrendingUp, Code, Users, Lightbulb, Target, Award, Building2, GraduationCap, Globe, Rocket, BarChart3, Cpu, Factory, FlaskConical, ChevronRight } from 'lucide-react';

interface CareerDomain {
  title: string;
  percentage: string;
  icon: any;
  color: string;
  gradient: string;
  roles: string[];
  description: string;
}

const CareerPage = () => {
  const [hoveredDomain, setHoveredDomain] = useState<number | null>(null);

  const careerDomains: CareerDomain[] = [
    {
      title: 'Technology and Digital Roles',
      percentage: '55-60%',
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-blue-50',
      description: 'This reflects the growing demand for technology professionals and the strong emphasis on computational and analytical skills across disciplines.',
      roles: [
        'Software development',
        'Data analytics and artificial intelligence',
        'Product engineering and digital platforms'
      ]
    },
    {
      title: 'Consulting, Analytics, and Business Roles',
      percentage: '15-20%',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      gradient: 'bg-purple-50',
      description: 'These roles attract students with strong problem solving, quantitative reasoning, and communication skills.',
      roles: [
        'Consulting and advisory services',
        'Business analysis and operations',
        'Strategy and analytics driven decision making'
      ]
    },
    {
      title: 'Core Engineering, Manufacturing, and Operations',
      percentage: '10-15%',
      icon: Factory,
      color: 'from-amber-500 to-amber-600',
      gradient: 'bg-amber-50',
      description: 'Interest in this domain is driven by students seeking application oriented engineering roles and long term industrial careers.',
      roles: [
        'Engineering design and systems',
        'Manufacturing, production, and quality',
        'Infrastructure and operations management'
      ]
    },
    {
      title: 'Research, Higher Education, and Innovation',
      percentage: '5-8%',
      icon: FlaskConical,
      color: 'from-green-500 to-green-600',
      gradient: 'bg-green-50',
      description: 'This group typically engages deeply with projects, laboratories, and research based learning during their academic tenure.',
      roles: [
        'Higher studies and research programs',
        'Academic and research-oriented careers',
        'Innovation driven and experimental roles'
      ]
    },
    {
      title: 'Entrepreneurship and Emerging Career Paths',
      percentage: '5-7%',
      icon: Rocket,
      color: 'from-rose-500 to-rose-600',
      gradient: 'bg-rose-50',
      description: 'This trend highlights growing interest in innovation, risk taking, and self driven career creation.',
      roles: [
        'Startups and entrepreneurial ventures',
        'Technology enabled business models',
        'Interdisciplinary and non-traditional career paths'
      ]
    }
  ];

  const opportunities = [
    {
      icon: GraduationCap,
      title: 'Academic Excellence',
      description: 'Strong theoretical foundations combined with applied learning, exposure to contemporary tools, technologies, and methodologies.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Building2,
      title: 'Internships and Industry Projects',
      description: 'Structured internship programs, industry sponsored projects, and research and innovation initiatives for real world experience.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Globe,
      title: 'Diverse Employment Sectors',
      description: 'Access to opportunities across technology, consulting, financial services, engineering, manufacturing, and public sector organizations.',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: Users,
      title: 'Career Guidance and Support',
      description: 'Career awareness sessions, institutional platforms for opportunity discovery, and transparent frameworks for informed decision-making.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const outcomes = [
    { label: 'High student participation in career opportunities', icon: TrendingUp },
    { label: 'Competitive compensation packages across sectors', icon: Award },
    { label: 'Opportunities in domestic and international organizations', icon: Globe },
    { label: 'Majority of offers in technology and analytics driven roles', icon: Code },
    { label: 'Steady proportion in consulting, finance, and operations', icon: BarChart3 },
    { label: 'Continued presence in core engineering and research', icon: Factory }
  ];

  const emergingAreas = [
    'Artificial Intelligence',
    'Sustainability',
    'Digital Infrastructure',
    'Data Driven Decision Making',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Blockchain Technology'
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
            <Briefcase className="w-12 h-12 text-nsut-yellow" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Career Opportunities at NSUT
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            Building Future-Ready Professionals
          </p>
          <p className="text-lg max-w-5xl mt-4 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            Netaji Subhas University of Technology (NSUT) provides a dynamic academic and professional environment that enables students to pursue diverse career pathways aligned with evolving industry demands and individual aspirations. The University supports students in exploring careers across technology driven sectors, consulting, finance, research, public service, and entrepreneurship.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        
        {/* Student Career Interest Trends */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Student Career Interest Trends
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Based on recent placement cycles, internship participation, and student enrollment preferences, career interests broadly align with the following domains
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {careerDomains.map((domain, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredDomain(index)}
                onMouseLeave={() => setHoveredDomain(null)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Header with gradient */}
                <div className={`h-2 bg-gradient-to-r ${domain.color}`}></div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-grow">
                      <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-2 group-hover:text-[#800000] transition-colors">
                        {domain.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-nsut-maroon to-nsut-yellow bg-clip-text text-transparent">
                          {domain.percentage}
                        </span>
                        <span className="text-gray-500 text-sm">of students</span>
                      </div>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${domain.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <domain.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {domain.description}
                  </p>

                  {/* Roles List */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Key Roles:</p>
                    {domain.roles.map((role, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg ${domain.gradient} transition-all duration-300 ${
                          hoveredDomain === index ? 'translate-x-2' : ''
                        }`}
                      >
                        <ChevronRight className={`w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5 ${
                          hoveredDomain === index ? 'text-nsut-maroon' : ''
                        } transition-colors`} />
                        <span className="text-gray-700 leading-relaxed">{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Opportunities Section */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            Career Opportunities Facilitated by NSUT
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            NSUT enables diverse career aspirations through multiple institutional opportunities that extend beyond conventional recruitment
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${opportunity.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <opportunity.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                  {opportunity.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {opportunity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Outcomes */}
        <div className="mb-20 bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <h2 className="font-serif text-4xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-10 h-10 text-nsut-yellow" />
            Career Outcomes and Placement Indicators
          </h2>
          <p className="text-lg mb-8 opacity-95 leading-relaxed">
            NSUT consistently records strong career outcomes, characterized by high student participation, competitive compensation packages, and opportunities in both domestic and international organizations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 animate-fade-in border border-white/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-nsut-yellow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <outcome.icon className="w-5 h-5 text-nsut-yellow" />
                </div>
                <span className="leading-relaxed">{outcome.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-sm opacity-90 leading-relaxed">
              <strong className="text-nsut-yellow">Note:</strong> Annual career and placement statistics are published through official University channels to ensure transparency and accountability. The balanced distribution of roles highlights NSUT's ability to support varied career ambitions.
            </p>
          </div>
        </div>

        {/* Emerging Areas */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            Evolving Career Preferences and Future Opportunities
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            Student career interests at NSUT continue to evolve in response to technological advancements, global economic trends, and interdisciplinary problem solving needs
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-6 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-nsut-yellow" />
              Emerging Areas of Focus
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {emergingAreas.map((area, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-nsut-beige/30 to-white hover:from-nsut-beige/50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:scale-105"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="w-2 h-2 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-full flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                  <span className="text-gray-700 font-medium group-hover:text-nsut-maroon transition-colors text-sm">
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Mechanisms */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-nsut-beige/40 via-white to-nsut-beige/40 rounded-2xl p-8 md:p-12 border border-gray-100">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-6 text-center flex items-center justify-center gap-3">
                <Target className="w-10 h-10 text-nsut-yellow" />
                Institutional Support Framework
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8 text-center">
                While student initiative plays a central role in career development, NSUT provides structured support designed to enable informed decision-making and facilitate exploration.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Career Awareness',
                    desc: 'Regular sessions and guidance programs to help students understand industry trends and opportunities',
                    icon: Users
                  },
                  {
                    title: 'Opportunity Discovery',
                    desc: 'Institutional platforms providing access to internships, projects, and employment opportunities',
                    icon: Target
                  },
                  {
                    title: 'Transparent Frameworks',
                    desc: 'Ethical and transparent processes governing career-related activities and recruitment',
                    icon: Award
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion CTA */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-serif text-3xl font-bold text-nsut-maroon mb-4">
              Your Career Journey Starts Here
            </h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              NSUT provides a comprehensive ecosystem that supports student aspirations across multiple career domains. By combining strong academic foundations with practical exposure, internships, and institutional career support, the University enables students to pursue careers aligned with their interests and the needs of a rapidly changing professional landscape.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.nsut.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-nsut-maroon to-[#800000] text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Globe className="w-5 h-5" />
                Visit NSUT Website
              </a>
            </div>
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

export default CareerPage;
