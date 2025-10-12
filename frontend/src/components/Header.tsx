import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import nsutLogo from "@/assets/nsut-logo.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Hide CTA buttons on login/signup routes
  const hideCTA =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/otp-verification" || location.pathname=== "/profile-form";

  // Replace anchors with actual routes
  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Network", to: "/network" },
    { label: "Events", to: "/events" },
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
  ];

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/otp-verification";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={nsutLogo} alt="NSUT Logo" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white">NSUT</span>
              <span className="text-xs text-white">SINCE 1983</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="transition-colors font-medium text-white hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA (hidden on login/signup) */}
          {!hideCTA && (
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/signup">Join Alumni</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${
              isAuthPage ? "text-primary" : "text-primary"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 border-t ${
              isAuthPage
                ? "bg-black/80 border-gray-700"
                : "bg-white border-border"
            }`}
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`font-medium py-2 px-4 ${
                    isAuthPage
                      ? "text-white hover:bg-gray-700"
                      : "text-foreground hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!hideCTA && (
                <div className="flex flex-col space-y-2 pt-4 px-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button className="bg-[#8B0712]" size="sm" asChild>
                    <Link to="/signup">Join Alumni</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;