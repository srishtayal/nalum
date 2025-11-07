import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Heart, Microscope, Building2, ArrowRight } from 'lucide-react';

interface GivingCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}

const GivingCard = ({ title, description, icon: Icon, index }: GivingCardProps) => (
  <div className="group">
    <div className="relative bg-white rounded-xl border-2 border-gray-100 hover:border-nsut-maroon/30 transition-all duration-300 overflow-hidden h-full">
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-nsut-maroon to-nsut-yellow transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
      
      <div className="p-6 pl-8">
        {/* Icon */}
        <div className="mb-4">
          <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-nsut-maroon/10 to-nsut-yellow/10 group-hover:from-nsut-maroon/20 group-hover:to-nsut-yellow/20 transition-all duration-300">
            <Icon className="h-6 w-6 text-nsut-maroon" strokeWidth={2} />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:text-nsut-maroon transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

        {/* Hover indicator */}
        <div className="mt-4 flex items-center text-nsut-maroon text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Learn more</span>
          <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  </div>
);

const GivingSection = () => {
  const givingCategories = [
    { 
      title: "NSUT Annual Fund", 
      description: "Support the university's most pressing needs and emerging opportunities",
      icon: Heart
    },
    { 
      title: "Scholarships & Aid", 
      description: "Help deserving students access quality education regardless of financial constraints",
      icon: GraduationCap
    },
    { 
      title: "Research & Innovation", 
      description: "Fund groundbreaking research and technological advancements",
      icon: Microscope
    },
    { 
      title: "Infrastructure", 
      description: "Contribute to building world-class facilities and campus development",
      icon: Building2
    },
    { 
      title: "Academic Programs", 
      description: "Enhance curriculum, faculty development, and learning resources",
      icon: BookOpen
    },
  ];

  return (
    <div className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nsut-maroon to-transparent opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-block mb-3">
            <span className="text-nsut-maroon text-sm font-semibold tracking-wider uppercase">
              Give Back
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            Make a Difference
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Support NSUT students and faculty in various ways, from funding scholarships to advancing critical research and infrastructure development.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {givingCategories.map((category, index) => (
            <GivingCard
              key={index}
              title={category.title}
              description={category.description}
              icon={category.icon}
              index={index}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              asChild 
              size="lg"
              className="bg-nsut-maroon hover:bg-nsut-maroon/90 text-white font-semibold px-8"
            >
              <Link to="/giving">
                Start Giving Today
              </Link>
            </Button>
            <Link 
              to="/giving/planned-giving" 
              className="text-nsut-maroon font-semibold hover:underline flex items-center gap-1"
            >
              Learn about planned giving
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {/* Trust indicator */}
          <p className="mt-6 text-sm text-gray-500">
            Your contribution is tax-deductible and goes directly to supporting NSUT's mission
          </p>
        </div>
      </div>
    </div>
  );
};

export default GivingSection;
