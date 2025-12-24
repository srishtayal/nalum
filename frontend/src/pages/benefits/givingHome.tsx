import { useState } from 'react';
import { Heart, Users, Briefcase, GraduationCap, Award, TrendingUp, DollarSign, MessageSquare, BookOpen, Lock, ArrowRight, ChevronRight, HandHeart, Building2, Lightbulb, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContributionType {
  icon: any;
  title: string;
  description: string;
  color: string;
  benefits: string[];
}

interface ImpactArea {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}

const GivingHome = () => {
  const [hoveredType, setHoveredType] = useState<number | null>(null);

  const contributionTypes: ContributionType[] = [
    {
      icon: Briefcase,
      title: 'Internship Opportunities',
      description: 'Provide structured internships to students in your organization, offering real-world working environments and professional exposure.',
      color: 'from-blue-500 to-blue-600',
      benefits: [
        'Expose students to industry expectations and professional ethics',
        'Enhance technical skills, communication, and problem-solving capacity',
        'Help students build professional networks early in their careers',
        'Bridge the gap between academic learning and industry requirements',
        'Increase students\' employability and placement outcomes'
      ]
    },
    {
      icon: Award,
      title: 'Scholarship & Financial Support',
      description: 'Support talented and deserving students facing financial constraints through scholarships covering tuition, books, accommodation, and more.',
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'Enable students to continue education without financial stress',
        'Promote inclusivity and equal opportunity within the institution',
        'Offer merit-based, need-based, or targeted group scholarships',
        'Empower students to focus on academic excellence and innovation',
        'Support students through batch-wise or inter-batch collective efforts'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Mentorship & Career Guidance',
      description: 'Guide students through one-on-one mentoring, group sessions, or panel discussions sharing practical career insights and life lessons.',
      color: 'from-amber-500 to-amber-600',
      benefits: [
        'Help students make informed decisions about career paths',
        'Guide on higher education, competitive exams, or entrepreneurship',
        'Build students\' confidence, resilience, and clarity of purpose',
        'Share real struggles, failures, and successes for realistic expectations',
        'Provide critical guidance during transition phases'
      ]
    },
    {
      icon: BookOpen,
      title: 'Academic & Institutional Support',
      description: 'Engage in academic activities through guest lectures, skill-based workshops, research initiatives, and institutional development.',
      color: 'from-green-500 to-green-600',
      benefits: [
        'Deliver guest lectures and conduct skill-based workshops',
        'Support research initiatives and collaborate on projects',
        'Enrich classroom learning with industry experience',
        'Keep academic content aligned with current trends',
        'Shape student-centric and future-ready policies'
      ]
    }
  ];

  const financialModes = [
    {
      title: 'Batch-wise Financial Support',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Alumni from the same graduating year pool resources together, creating shared responsibility and nostalgia-driven commitment.',
      features: [
        'Strong sense of batch identity and connection',
        'Easier coordination and transparency',
        'Support need-based scholarships and emergency aid',
        'Fund departmental initiatives and academic resources',
        'Clear visibility of collective effort outcomes'
      ]
    },
    {
      title: 'Inter-batch Financial Support',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
      description: 'Collaboration across multiple graduating years fostering broader alumni networks and larger-scale institutional impact.',
      features: [
        'Support ambitious long-term scholarship programs',
        'Enable mentorship-linked financial aid',
        'Fund research grants and student welfare initiatives',
        'Promote unity across generations',
        'Ensure continuity of support rather than one-time assistance'
      ]
    }
  ];

  const impactAreas: ImpactArea[] = [
    {
      icon: TrendingUp,
      title: 'Student Development',
      description: 'Direct impact on student learning, skills, confidence, and career readiness through real-world exposure and guidance.',
      gradient: 'bg-blue-50'
    },
    {
      icon: Building2,
      title: 'Institutional Growth',
      description: 'Strengthen institutional credibility, enhance academic programs, and support infrastructure development.',
      gradient: 'bg-purple-50'
    },
    {
      icon: HandHeart,
      title: 'Community Building',
      description: 'Foster lifelong bonds between graduates and alma mater, creating a sustainable cycle of growth and gratitude.',
      gradient: 'bg-amber-50'
    },
    {
      icon: Lightbulb,
      title: 'Innovation & Excellence',
      description: 'Support research initiatives, academic innovation, and nurture capable, ethical, socially responsible graduates.',
      gradient: 'bg-green-50'
    }
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
            <Heart className="w-12 h-12 text-nsut-yellow" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Giving Back to NSUT
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            Sustaining Excellence Through Alumni Contributions
          </p>
          <p className="text-lg max-w-5xl mt-6 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            Alumni form the backbone of an institution's long-term growth and reputation. Having once been students themselves, alumni understand the academic pressures, career uncertainties, and personal challenges that learners face. By giving back, alumni help sustain a supportive ecosystem where knowledge, opportunity, and values are passed from one generation to the next. Alumni contributions strengthen institutional credibility, enhance student outcomes, and foster a lifelong bond between graduates and their alma mater.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        
        {/* Introduction */}
        <div className="mb-20 text-center">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-6 animate-fade-in">
            Ways to Contribute
          </h2>
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed animation-delay-200 animate-fade-in">
            There are several meaningful and impactful ways through which alumni can contribute, each addressing a different aspect of student development and institutional progress. These contributions can be professional, financial, academic, or mentorship-based, allowing alumni to engage according to their expertise, availability, and interests.
          </p>
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
                Start Your Giving Journey
              </h2>
              <p className="text-xl mb-8 leading-relaxed opacity-95">
                To contribute and make a difference in students' lives, please login to your alumni account. Join fellow NSUTians in building a stronger future!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/login"
                  className="group bg-nsut-yellow hover:bg-nsut-yellow/90 text-nsut-maroon px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Login to Start Giving
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
                Already a member? Simply login to explore giving opportunities!
              </p>
            </div>
          </div>
        </div>

        {/* Contribution Types */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Types of Contributions
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Choose from various impactful ways to support current students and strengthen the institution
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {contributionTypes.map((type, index) => (
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

                  {/* Benefits List */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Key Benefits:</p>
                    {type.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 transition-all duration-300 ${
                          hoveredType === index ? 'translate-x-2 bg-nsut-beige/30' : ''
                        }`}
                      >
                        <ChevronRight className={`w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5 ${
                          hoveredType === index ? 'text-nsut-maroon' : ''
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

        {/* Financial Support Modes */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4">
              Financial Support Models
            </h2>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto">
              Financial support can be extended effectively through batch-wise or inter-batch collective efforts, allowing alumni to contribute in an organized, inclusive, and impactful manner
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {financialModes.map((mode, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-2xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                      {mode.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Features:</p>
                  {mode.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2">
                      <ChevronRight className="w-4 h-4 text-nsut-maroon flex-shrink-0 mt-1" />
                      <span className="text-gray-700 leading-relaxed text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Areas */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            Your Impact Across Key Areas
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            Alumni contributions create meaningful impact across multiple dimensions of student life and institutional development
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactAreas.map((area, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <area.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-nsut-beige to-nsut-beige/50 rounded-2xl p-10 border border-nsut-yellow/30 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-nsut-maroon mb-6 text-center">
                Creating a Sustainable Cycle of Excellence
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
                <p>
                  Alumni giving back is not limited to financial donations alone. It encompasses sharing time, expertise, opportunities, and resources to uplift students and strengthen the institution. By contributing through internships, scholarships, mentorship, and academic engagement, alumni create a sustainable cycle of growth, gratitude, and excellence.
                </p>
                <p>
                  Such collective efforts ensure that the institution continues to nurture capable, ethical, and socially responsible graduates for years to come. Every contribution, regardless of its form or scale, makes a meaningful difference in shaping the future of NSUT and its students.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-nsut-maroon to-[#800000] rounded-2xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-nsut-yellow/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg mb-8 max-w-3xl mx-auto opacity-95">
                Join thousands of alumni who are actively contributing to student success and institutional excellence. Your support creates lasting impact.
              </p>
              <Link 
                to="/login"
                className="group inline-flex items-center gap-2 bg-nsut-yellow hover:bg-nsut-yellow/90 text-nsut-maroon px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Login to Start Contributing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GivingHome;
