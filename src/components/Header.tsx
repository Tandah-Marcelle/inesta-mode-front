import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';

import logo from '../assets/images/InestaLogo/logo.jpg'
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cart } = useShop();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Inesta Mode Logo" className="h-10 w-10 mr-2" />
          <span className={`font-display font-semibold text-2xl ${isScrolled ? 'text-primary-800' : 'text-primary-800 md:text-white'}`}>
            Inesta Mode
          </span>
        </Link>
        
        <nav className={`hidden md:flex space-x-8 ${isScrolled ? 'text-secondary-800' : 'text-white'}`}>
          {isHomePage ? (
            <>
              <button onClick={() => scrollToSection('collections')} className="hover:text-primary-500 transition-colors">Collections</button>
              <button onClick={() => scrollToSection('featured')} className="hover:text-primary-500 transition-colors">Featured</button>
              <button onClick={() => scrollToSection('news')} className="hover:text-primary-500 transition-colors">News</button>
              <button onClick={() => scrollToSection('sponsors')} className="hover:text-primary-500 transition-colors">Sponsors</button>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
              <Link to="/collections" className="hover:text-primary-500 transition-colors">Collections</Link>
              <Link to="/news" className="hover:text-primary-500 transition-colors">News</Link>
              <Link to="/sponsors" className="hover:text-primary-500 transition-colors">Sponsors</Link>
            </>
          )}
          <Link to="/about" className="hover:text-primary-500 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-primary-500 transition-colors">Contact</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingBag className={`h-6 w-6 ${isScrolled ? 'text-secondary-800' : 'text-white'}`} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          
          <button 
            onClick={toggleMenu} 
            className={`md:hidden ${isScrolled ? 'text-secondary-800' : 'text-white'}`}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 md:hidden`}>
        <div className="container mx-auto px-4 py-5 flex flex-col h-full">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Inesta Mode Logo" className="h-10 w-10 mr-2" />
              <span className="font-display font-semibold text-2xl text-primary-800">
                Inesta Mode
              </span>
            </Link>
            <button onClick={toggleMenu} className="text-secondary-800">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-6 mt-12 text-lg">
            {isHomePage ? (
              <>
                <button onClick={() => { scrollToSection('collections'); toggleMenu(); }} className="text-left hover:text-primary-500 transition-colors">Collections</button>
                <button onClick={() => { scrollToSection('featured'); toggleMenu(); }} className="text-left hover:text-primary-500 transition-colors">Featured</button>
                <button onClick={() => { scrollToSection('news'); toggleMenu(); }} className="text-left hover:text-primary-500 transition-colors">News</button>
                <button onClick={() => { scrollToSection('sponsors'); toggleMenu(); }} className="text-left hover:text-primary-500 transition-colors">Sponsors</button>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
                <Link to="/collections" className="hover:text-primary-500 transition-colors">Collections</Link>
                <Link to="/news" className="hover:text-primary-500 transition-colors">News</Link>
                <Link to="/sponsors" className="hover:text-primary-500 transition-colors">Sponsors</Link>
              </>
            )}
            <Link to="/about" className="hover:text-primary-500 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary-500 transition-colors">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;