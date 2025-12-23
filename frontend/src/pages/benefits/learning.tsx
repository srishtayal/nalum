import { useState } from 'react';
import { BookOpen, GraduationCap, Microscope, Cpu, TrendingUp, Award, Users, Lightbulb, Target, ChevronDown, ChevronUp } from 'lucide-react';

interface Program {
  title: string;
  programs: string[];
}

interface ProgramSection {
  level: string;
  icon: any;
  color: string;
  description: string;
  programs: string[];
}

const LearningPage = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const programSections: ProgramSection[] = [
    {
      level: 'Undergraduate Programs',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
      description: 'Undergraduate programs span a range of core technical and applied disciplines, equipping students with deep subject knowledge, analytical skills, and real-world problem-solving capabilities.',
      programs: [
        'Electronics and Communication Engineering',
        'Computer Engineering',
        'Computer Science and Engineering (with Artificial Intelligence focus)',
        'Mathematics and Computing',
        'Electrical Engineering',
        'Instrumentation and Control Engineering',
        'Manufacturing Process and Automation Engineering',
        'Mechanical Engineering',
        'Information Technology',
        'Bio-Technology',
        'Architecture and Design',
        'Management and Business Foundations'
      ]
    },
    {
      level: 'Postgraduate Programs',
      icon: Microscope,
      color: 'from-purple-500 to-purple-600',
      description: 'Postgraduate studies focus on advanced and specialized areas of engineering, technology, and management, designed to deepen technical expertise and foster leadership in industry and academia.',
      programs: [
        'Computer Science and Advanced Computing',
        'Signal Processing and Communication Systems',
        'Embedded Systems and VLSI',
        'Process Control and Industrial Automation',
        'Industrial Electronics',
        'Mechatronics and Production Engineering',
        'Engineering Management',
        'CAD/CAM and Manufacturing Systems',
        'Bioinformatics and Nano Technology',
        'Related interdisciplinary fields'
      ]
    },
    {
      level: 'Doctoral Programs',
      icon: Award,
      color: 'from-amber-500 to-amber-600',
      description: 'Doctor of Philosophy (Ph.D.) programs encourage original research across multiple disciplines, preparing scholars for careers in research institutions, academia, and industry-research collaborations.',
      programs: [
        'Electronics and Communication Engineering',
        'Computer Engineering',
        'Instrumentation and Control Engineering',
        'Manufacturing Process and Automation Engineering',
        'Information Technology',
        'Bio-Technology',
        'Management Studies',
        'Humanities and Social Sciences',
        'Mathematics',
        'Physics',
        'Chemistry'
      ]
    }
  ];

  const specializations = [
    { name: 'Artificial Intelligence and Machine Learning', icon: Cpu },
    { name: 'Data Science and Analytics', icon: TrendingUp },
    { name: 'Internet of Things (IoT)', icon: Cpu },
    { name: 'Cybersecurity and Networks', icon: Target },
    { name: 'Design and Innovation', icon: Lightbulb },
    { name: 'Lean Manufacturing and Automation', icon: Target }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Choice-Based Credit System',
      description: 'Flexible curriculum allowing students to tailor their learning through core, elective, and interdisciplinary courses.'
    },
    {
      icon: Users,
      title: 'Industry Partnerships',
      description: 'Collaboration with industry partners through guest lectures, internships, and real-world projects.'
    },
    {
      icon: Lightbulb,
      title: 'Research & Innovation',
      description: 'Access to research centres, innovation labs, and opportunities for original research and development.'
    },
    {
      icon: Target,
      title: 'Hands-on Learning',
      description: 'Practical lab work, project-based assignments, and exposure to emerging technologies.'
    }
  ];

  const benefits = [
    'Balanced blend of theory and practice',
    'Curriculum informed by industry trends',
    'Faculty with research and industry experience',
    'Opportunities for global exposure and research collaboration',
    'Strong foundation for advanced degrees and careers worldwide',
    'Professional and ethical development',
    'Interdisciplinary learning opportunities'
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
            <BookOpen className="w-12 h-12 text-nsut-yellow" />
            <h1 className="font-serif text-5xl md:text-6xl font-bold">
              Learning at NSUT
            </h1>
          </div>
          <p className="text-xl md:text-2xl max-w-5xl leading-relaxed opacity-95 animation-delay-300 animate-fade-in">
            Academic Excellence with Diverse Programs
          </p>
          <p className="text-lg max-w-5xl mt-4 leading-relaxed opacity-90 animation-delay-500 animate-fade-in">
            Netaji Subhas University of Technology (NSUT), Delhi offers a wide spectrum of high-quality academic programs designed to prepare students for careers in engineering, technology, research, and management. These programs are grounded in a strong theoretical foundation, hands-on learning, and industry relevance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Key Features Grid */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-12 text-center">
            Curriculum Structure & Learning Approach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-xl font-bold text-nsut-maroon mb-3 group-hover:text-[#800000] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Programs Sections */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            Programs & Courses Offered
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            NSUT offers programs at the Undergraduate, Postgraduate, and Doctoral levels across engineering, science, management, and technology disciplines.
          </p>
          
          <div className="space-y-6">
            {programSections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.level)}
                  className="w-full flex items-center justify-between p-6 bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center shadow-lg`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-serif text-2xl font-bold text-nsut-maroon">
                        {section.level}
                      </h3>
                    </div>
                  </div>
                  <div className="text-nsut-maroon">
                    {expandedSection === section.level ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </button>

                {/* Expandable Content */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    expandedSection === section.level
                      ? 'max-h-[2000px] opacity-100'
                      : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="p-6 pt-0 border-t border-gray-100">
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {section.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {section.programs.map((program, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-nsut-beige/30 hover:to-white transition-all duration-300 border border-gray-100"
                        >
                          <div className="w-2 h-2 bg-nsut-yellow rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {program}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-20">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-4 text-center">
            Specialized Tracks & Emerging Areas
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-4xl mx-auto text-lg">
            To align with evolving global trends, NSUT offers opportunities for specialization in cutting-edge areas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in flex items-center gap-4 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <spec.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-gray-800 group-hover:text-nsut-maroon transition-colors">
                  {spec.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Beyond Classroom */}
        <div className="mb-20 bg-gradient-to-br from-nsut-maroon to-[#800000] rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <h2 className="font-serif text-4xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-10 h-10 text-nsut-yellow" />
            Learning Beyond the Classroom
          </h2>
          <p className="text-lg mb-8 opacity-95 leading-relaxed">
            NSUT encourages a holistic approach to learning through various initiatives that help students apply classroom knowledge to real-world challenges and build professional confidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Industry partnerships and guest lectures',
              'Interdisciplinary projects and capstone assignments',
              'Research centres and innovation labs',
              'Seminars, workshops, and short-term professional courses',
              'Student clubs, competitions, and community initiatives',
              'Global exposure and research collaboration'
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-nsut-yellow rounded-full mt-2 flex-shrink-0"></div>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why NSUT Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="font-serif text-4xl font-bold text-nsut-maroon mb-8 text-center flex items-center justify-center gap-3">
            <Target className="w-10 h-10 text-nsut-yellow" />
            Why NSUT for Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-nsut-beige/20 to-white hover:from-nsut-beige/40 hover:to-white transition-all duration-300 border border-gray-100 hover:border-nsut-yellow/50 animate-fade-in hover:-translate-x-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-nsut-maroon to-nsut-yellow rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-gray-700 leading-relaxed group-hover:text-nsut-maroon transition-colors">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-nsut-beige/30 to-transparent rounded-2xl p-12">
          <h3 className="font-serif text-3xl font-bold text-nsut-maroon mb-4">
            Join the NSUT Legacy
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-3xl mx-auto">
            NSUT follows a flexible and modern credit-based curriculum that encourages interdisciplinary learning and innovation, preparing students for careers in engineering, technology, research, and management.
          </p>
          <a
            href="https://www.nsut.ac.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-nsut-maroon to-[#800000] text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Explore NSUT Programs
          </a>
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

export default LearningPage;
