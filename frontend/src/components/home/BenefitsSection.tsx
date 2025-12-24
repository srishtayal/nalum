import { Sparkles, BookOpen, Briefcase, GraduationCap, Globe } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      label: 'All Benefits',
      icon: Sparkles,
      variant: 'primary' as const
    },
    {
      label: 'Library E-Resources',
      icon: BookOpen,
      variant: 'secondary' as const
    },
    {
      label: 'Career Resources',
      icon: Briefcase,
      variant: 'secondary' as const
    },
    {
      label: 'Learning Portal',
      icon: GraduationCap,
      variant: 'secondary' as const
    },
  ];

  return (
    <div className="relative py-16 md:py-24 bg-gradient-to-br from-nsut-maroon via-red-900 to-nsut-maroon text-white overflow-hidden">
      {/* Background pattern - lighter opacity for dark background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Decorative gradient accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-nsut-yellow/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-nsut-yellow/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Header */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="inline-block mb-3">
            <span className="text-nsut-yellow text-xs md:text-sm font-semibold tracking-wider uppercase">
              Exclusive Benefits
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            NSUT Gives Back to You
          </h2>
          <p className="text-base md:text-lg text-white/90 leading-relaxed">
            You're a member of the NSUT family for life, and that brings with it a lifetime of rewards and exclusive access to resources.
          </p>
        </div>

        {/* Benefits Buttons */}
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <button
              key={index}
              className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 overflow-hidden ${benefit.variant === 'primary'
                  ? 'bg-nsut-yellow text-nsut-maroon hover:bg-nsut-yellow/90 shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 backdrop-blur-sm'
                }`}
            >
              {/* Hover effect for secondary buttons */}
              {benefit.variant === 'secondary' && (
                <div className="absolute inset-0 bg-gradient-to-r from-nsut-yellow/0 via-nsut-yellow/10 to-nsut-yellow/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}

              <benefit.icon className="h-5 w-5 relative z-10" strokeWidth={2} />
              <span className="relative z-10">{benefit.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom text */}
        <p className="mt-10 text-white/70 text-sm">
          Access exclusive discounts, career services, and lifelong learning opportunities
        </p>
      </div>
    </div>
  );
};

export default BenefitsSection;
