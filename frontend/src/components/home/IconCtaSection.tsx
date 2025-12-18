import { Link } from 'react-router-dom';
import { Calendar, Users, Megaphone, ArrowRight } from 'lucide-react';

const IconCtaSection = () => {
  const ctaItems = [
    {
      icon: Calendar,
      text: "Attend an Event",
      description: "Join upcoming reunions, workshops, and campus celebrations",
      link: "/events/events-calendar",
      gradient: "from-nsut-maroon to-red-800",
      bgColor: "bg-red-50",
      hoverColor: "group-hover:bg-red-100"
    },
    {
      icon: Users,
      text: "Explore Communities",
      description: "Connect with fellow alumni who share your interests",
      link: "/communities-interests",
      gradient: "from-nsut-yellow to-amber-500",
      bgColor: "bg-amber-50",
      hoverColor: "group-hover:bg-amber-100"
    },
  ];

  return (
    <div className="relative bg-gradient-to-b from-white via-nsut-beige/30 to-white py-12 md:py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
            Get Involved
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Stay connected and make an impact in the NSUT community
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {ctaItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="group relative block"
            >
              <div className={`relative overflow-hidden rounded-2xl ${item.bgColor} ${item.hoverColor} border-2 border-transparent hover:border-gray-200 transition-all duration-500 h-full`}>
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className="relative p-8">
                  {/* Icon container with animation */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.gradient} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-2xl`}>
                      <item.icon className="h-8 w-8 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-nsut-maroon group-hover:to-red-700 transition-all duration-300">
                    {item.text}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-nsut-maroon font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${item.gradient} blur-xl`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Want to explore more ways to engage?{' '}
            <Link to="/volunteer" className="text-nsut-maroon font-semibold hover:underline">
              View all opportunities →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default IconCtaSection;
