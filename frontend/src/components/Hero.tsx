import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Briefcase, Heart } from "lucide-react";
import campusImage from "@/assets/banner.webp";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={campusImage}
          alt="NSUT Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-35"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/30 p-8">
          {/* Welcome Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/20">
            <span className="text-sm font-medium">Welcome to the NSUT Alumni Portal</span>
          </div>

          {/* Main Heading */}
          <h1 className="heading-hero mb-6">
            Connect. Grow. Give Back.
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed max-w-3xl mx-auto">
            Join thousands of NSUT alumni worldwide. Whether you're here to reconnect, 
            expand your network, or contribute to our growing community, you're in the right place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="accent" size="xl" className="group" asChild>
              <Link to="/signup">
                Join Alumni Network
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline-hero" size="xl" asChild>
              <Link to="/login">Explore Portal</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-nsut-gold" />
              </div>
              <div className="text-2xl font-bold">15,000+</div>
              <div className="text-sm text-white/80">Alumni Members</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Calendar className="h-8 w-8 text-nsut-gold" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/80">Annual Events</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Briefcase className="h-8 w-8 text-nsut-gold" />
              </div>
              <div className="text-2xl font-bold">2,000+</div>
              <div className="text-sm text-white/80">Job Opportunities</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Heart className="h-8 w-8 text-nsut-gold" />
              </div>
              <div className="text-2xl font-bold">₹50L+</div>
              <div className="text-sm text-white/80">Donations Raised</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;