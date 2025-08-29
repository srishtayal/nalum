import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap
} from "lucide-react";
import nsutLogo from "@/assets/nsut-logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Quick Links": [
      { label: "Home", href: "#home" },
      { label: "About NSUT", href: "#about" },
      { label: "Alumni Directory", href: "#network" },
      { label: "Events", href: "#events" },
      { label: "Career Services", href: "#careers" }
    ],
    "Resources": [
      { label: "Mentorship", href: "/mentorship" },
      { label: "Job Board", href: "/jobs" },
      { label: "Alumni Benefits", href: "/benefits" },
      { label: "Student Support", href: "/support" },
      { label: "Research Collaboration", href: "/research" }
    ],
    "Get Involved": [
      { label: "Join Alumni Network", href: "/join" },
      { label: "Volunteer Opportunities", href: "/volunteer" },
      { label: "Donate to NSUT", href: "/donate" },
      { label: "Host an Event", href: "/host" },
      { label: "Partner with Us", href: "/partners" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
  <footer className="bg-[#8B0712] border-t border-border">
      <div className="container mx-auto px-4 py-16">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={nsutLogo} alt="NSUT Logo" className="h-12 w-12" />
              <div>
                <h3 className="font-bold text-xl text-white">NSUT Alumni Portal</h3>
                <p className="text-sm text-gray-200">Since 1983</p>
              </div>
            </div>
            <p className="text-gray-200 mb-6 leading-relaxed">
              Connecting NSUT alumni worldwide through a comprehensive platform that fosters 
              networking, career growth, and meaningful contributions to our alma mater.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-gray-200">
                  Netaji Subhas University of Technology, Dwarka, New Delhi - 110078
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-white" />
                <span className="text-gray-200">alumni@nsut.ac.in</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-white" />
                <span className="text-gray-200">+91-11-25000123</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white hover:text-[#8B0712] transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-200 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-200 mb-4 md:mb-0">
              <span>© {currentYear} NSUT Alumni Portal. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="/privacy" className="text-gray-200 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-200 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/accessibility" className="text-gray-200 hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;