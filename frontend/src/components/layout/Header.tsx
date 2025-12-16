import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const Header = ({ setHeaderHeight }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // --- Hardcoded Nav Links ---
  const navLinks = {
    "Communities & Interests": [
      "Clubs",
      "Classes",
      "Affinity Groups",
      "Recent Grads",
      "Families",
      "Industries",
    ],
    Volunteer: ["Opportunities", "Advocacy", "Tools & Resources", "Recognition"],
    Events: ["Calendar", "Campus Dance", "Reunions", "Medical Reunion Weekend"],
    Benefits: [
      "NSUTConnect+",
      "Career",
      "Learning",
      "Perks",
      "Alumni Directory",
    ],
    Giving: [
      "How to Give",
      "Annual Fund",
      "Athletics",
      "Planned Giving",
      "Donor Recognition",
    ],
    Stories: ["Notable Alumni", "Alumni Stories", "Giving Stories", "Campus News", "All Stories"],
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
      <style>{`
        .nav-link {
          position: relative;
          text-decoration: none;
          color: #1f2937;
          transition: color 0.3s ease;
        }
        .nav-link span {
          position: relative;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #800000 0%, #b8860b 100%);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px;
        }
        .nav-link:hover {
          color: #800000;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        
        .dropdown-menu {
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .group:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .dropdown-link {
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        .dropdown-link::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background-color: #800000;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        .dropdown-link:hover::before {
          transform: translateX(0);
        }
        .dropdown-link:hover {
          padding-left: 1.25rem;
          background: linear-gradient(90deg, #fef3c7 0%, transparent 100%);
        }
        
        .top-bar-link {
          position: relative;
          transition: color 0.2s ease;
        }
        .top-bar-link::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background-color: #b8860b;
          transition: width 0.3s ease;
        }
        .top-bar-link:hover::after {
          width: 100%;
        }
        
        .gift-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .gift-button::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .gift-button:hover::before {
          width: 300px;
          height: 300px;
        }
        .gift-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(184, 134, 11, 0.4);
        }
      `}</style>
      <header
        ref={headerRef}
        className="w-full fixed top-0 z-50"
      >
        {/* === TOP BAR === */}
        <div
          className={`bg-nsut-maroon text-white transition-all duration-300 ${scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 py-1"
            }`}
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
              <Link to="/about" className="top-bar-link hover:text-nsut-yellow">
                About
              </Link>
              <Link to="/login" className="top-bar-link hover:text-nsut-yellow">
                myNSUT Login
              </Link>
              <a
                href="/giving"
                className="gift-button bg-nsut-yellow text-nsut-maroon font-bold py-1 px-3 rounded text-xs relative z-10"
              >
                Make a Gift
              </a>
            </div>
          </div>
        </div>

        {/* === MAIN NAVBAR === */}
        <div
          className={`bg-white shadow-md transition-all duration-300 ${scrolled ? "py-4" : "py-10"
            }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link
              to="/"
              className="font-serif text-2xl font-bold text-nsut-maroon"
            >
              NALUM
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {Object.entries(navLinks).map(([title, sublinks]) => (
                <div key={title} className="group relative">
                  <button className="font-serif nav-link">
                    <span>{title}</span>
                  </button>
                  <div className="dropdown-menu absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-48 z-10 border border-gray-100">
                    {sublinks.map((link) => (
                      <Link
                        key={link}
                        to={`/${title
                          .toLowerCase()
                          .replace(/ & /g, "-")}/${link
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                        className="dropdown-link block px-4 py-2 text-sm text-gray-700"
                      >
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Search + Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-600 hover:text-nsut-maroon transition-all duration-300 hover:scale-110"
                aria-label="Toggle search"
              >
                <Search />
              </button>
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

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="container mx-auto px-4 py-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-nsut-maroon focus:outline-none focus:ring-2 focus:ring-nsut-maroon/20 transition-all duration-300"
                autoFocus
              />
            </div>
          )}
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
                <span className="font-serif text-lg font-semibold text-nsut-maroon">
                  NALUM
                </span>
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
