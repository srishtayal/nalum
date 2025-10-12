import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Network,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Alumni Network",
      description: "Connect with over 15,000 NSUT graduates across the globe. Find mentors, collaborators, and lifelong friends.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Calendar,
      title: "Events & Reunions",
      description: "Stay updated with alumni meetups, technical talks, reunions, and networking events happening worldwide.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Briefcase,
      title: "Career Opportunities",
      description: "Access exclusive job postings, career guidance, and mentorship from successful NSUT alumni in various industries.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: GraduationCap,
      title: "Mentorship Programs",
      description: "Join our structured mentorship programs to guide current students or advance your own career with experienced alumni.",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: Heart,
      title: "Give Back",
      description: "Support NSUT's growth through donations, scholarships, infrastructure development, and student welfare programs.",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: MessageCircle,
      title: "Discussion Forums",
      description: "Engage in meaningful discussions about technology, industry trends, research, and share your expertise with the community.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
            <Network className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Why Join Our Community</span>
          </div>
          <h2 className="heading-section mb-4">
            Everything You Need to Stay Connected
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform brings together alumni, students, and faculty to create 
            a thriving ecosystem of collaboration, growth, and mutual support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-white/30 p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="card-elevated p-6 group cursor-pointer">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <Button variant="ghost" size="sm" className="text-primary p-0 h-auto group-hover:text-primary-hover">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-[#8B0712] rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join the NSUT Family?
            </h3>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Take the first step towards connecting with an incredible network of NSUT alumni. 
              Your journey of lifelong connections starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  variant="accent"
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline-hero" size="lg">
                Browse Directory
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;