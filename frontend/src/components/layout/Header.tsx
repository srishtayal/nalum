import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import nsutLogo from "@/assets/logo.webp";

const Header = ({ setHeaderHeight }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  // --- Hardcoded Nav Links ---
  const navLinks = {
    "Communities": [
      "Clubs",
      "Recent Grads",
      "Industries",
    ],
    Benefits: [
      "Career",
      "Learning",
      "Alumni Directory",
    ],
    Giving:[],
    Stories: ["Notable Alumni", "Alumni Stories", "Giving Stories", "Campus News"],
  };

  // --- Handle scroll effects and dynamic height ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200); // Increased scroll threshold
    };

    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateHeight);

    // Update height initially and after transitions
    updateHeight();
    const timer = setTimeout(updateHeight, 300); // Allow transition to finish

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timer);
    };
  }, [scrolled, setHeaderHeight]);

  return (
    <>
      <header
        ref={headerRef}
        className="w-full fixed top-0 z-50"
        style={{ minHeight: scrolled ? '80px' : '120px' }}
      >
        {/* === TOP BAR === */}
        <div
          className={`bg-nsut-maroon text-white transition-all duration-300 ${scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 py-1"
            }`}
          style={{ willChange: scrolled ? 'auto' : 'height, opacity' }}
        >
          <div className="container mx-auto px-4 flex justify-between items-center border-b border-nsut-yellow/30">
            <a
              href="https://www.nsut.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <span className="font-serif text-md">
                Netaji Subhas University of Technology
              </span>
            </a>
            <div className="hidden md:flex items-center space-x-4 text-xs">
              <Link to="/about" className="relative transition-colors duration-200 hover:text-nsut-yellow after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-px after:bg-nsut-yellow after:transition-all after:duration-300 hover:after:w-full">
                About
              </Link>
              <Link to="/login" className="relative transition-colors duration-200 hover:text-nsut-yellow after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-px after:bg-nsut-yellow after:transition-all after:duration-300 hover:after:w-full">
                myNSUT Login
              </Link>
              <a
                href="/giving"
                className="bg-nsut-yellow text-nsut-maroon font-bold py-1 px-3 rounded text-xs relative z-10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-nsut-yellow/40"
              >
                Make a Gift
              </a>
            </div>
          </div>
        </div>

        {/* === MAIN NAVBAR === */}
        <div
          className={`bg-white shadow-md transition-all duration-300 overflow-visible ${scrolled ? "py-4" : "py-10"
            }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center overflow-visible">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <img
                ref={logoRef}
                src={nsutLogo}
                alt="Logo"
                width="80"
                height="80"
                className="relative z-20 h-16 md:h-20 w-auto object-contain "
              />
              <div className="flex flex-col items-start">
                <h1 className="text-xl md:text-2xl font-bold leading-none tracking-wide text-gray-800 whitespace-nowrap">
                  <span className="text-red-600">N</span>SUT
                  <span className="text-red-600"> ALUM</span>NI
                </h1>
                <span className="block text-[8px] md:text-xs text-gray-700 font-bold tracking-widest">
                  ASSOCIATION
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {Object.entries(navLinks).map(([title, sublinks], index) => (
                title === "Giving" ? (
                  <Link
                    key={title}
                    to="/giving"
                    className="font-serif relative text-gray-800 transition-colors duration-300 hover:text-nsut-maroon after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-nsut-maroon after:to-nsut-yellow after:transition-all after:duration-400 after:ease-out after:rounded-sm hover:after:w-full"
                  >
                    <span className="relative">{title}</span>
                  </Link>
                ) : (
                  <div key={title} className="group relative">
                    <button className="font-serif relative text-gray-800 transition-colors duration-300 hover:text-nsut-maroon after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-nsut-maroon after:to-nsut-yellow after:transition-all after:duration-400 after:ease-out after:rounded-sm hover:after:w-full">
                      <span className="relative">{title}</span>
                    </button>
                    <div className={`absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-48 z-[100] border border-gray-100 opacity-0 invisible -translate-y-2.5 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 ${title === "Stories" ? "right-0 xl:left-0 xl:right-auto" : "left-0"}`}>
                      {sublinks.map((link) => (
                        <Link
                          key={link}
                          to={`/${title
                            .toLowerCase()
                            .replace(/ & /g, "-")}/${link
                              .toLowerCase()
                              .replace(/ /g, "-")}`}
                          className="block px-4 py-2 text-sm text-gray-700 relative overflow-hidden transition-all duration-200 before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-nsut-maroon before:-translate-x-full before:transition-transform before:duration-300 hover:before:translate-x-0 hover:pl-5 hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent"
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 hover:text-nsut-maroon transition-all duration-300 hover:scale-110"
                aria-label="Open mobile menu"
              >
                <Menu />
              </button>
            </div>
          </div>
        </div>

        {/* === MOBILE MENU === */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 p-4 transform transition-transform duration-300 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col items-start">
                  <h1 className="text-lg font-bold leading-none tracking-wide text-gray-800 whitespace-nowrap">
                    <span className="text-red-600">N</span>SUT
                    <span className="text-red-600"> ALUM</span>NI
                  </h1>
                  <span className="block text-[7px] text-gray-700 font-bold tracking-widest">
                    ASSOCIATION
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-nsut-maroon transition-colors duration-200 hover:scale-110"
                  aria-label="Close mobile menu"
                >
                  <X />
                </button>
              </div>

              <nav className="flex flex-col space-y-4 pb-8">
                {/* Mobile CTAs at top for visibility */}
                <div className="flex flex-col gap-3 mb-4">
                  <Link to="/login" className="bg-nsut-maroon text-white font-bold py-2 px-4 rounded hover:shadow-lg hover:scale-105 transition-all duration-300 text-center">
                    myNSUT Login
                  </Link>
                  <a
                    href="/giving"
                    className="bg-nsut-yellow text-nsut-maroon font-bold py-2 px-4 rounded hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                  >
                    Make a Gift
                  </a>
                </div>
                <hr className="border-gray-200" />

                {Object.entries(navLinks).map(([title, sublinks]) => (
                  title === "Giving" ? (
                    <Link
                      key={title}
                      to="/giving"
                      className="font-serif text-nsut-maroon font-semibold hover:underline transition-all duration-200"
                    >
                      {title}
                    </Link>
                  ) : (
                    <div key={title}>
                      <h3 className="font-serif text-nsut-maroon mb-2 font-semibold">
                        {title}
                      </h3>
                      {sublinks.map((link) => (
                        <Link
                          key={link}
                          to={`/${title
                            .toLowerCase()
                            .replace(/ & /g, "-")}/${link
                              .toLowerCase()
                              .replace(/ /g, "-")}`}
                          className="block pl-4 py-1 text-sm hover:bg-gradient-to-r hover:from-nsut-beige hover:to-transparent hover:pl-6 transition-all duration-200 rounded"
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  )
                ))}
                <hr className="border-gray-200" />
                <Link to="/about" className="hover:text-nsut-maroon transition-colors duration-200 font-medium">
                  About
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
