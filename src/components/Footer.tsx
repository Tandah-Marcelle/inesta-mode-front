import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-secondary-950 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-display text-xl mb-4">Inesta Mode</h3>
            <p className="text-gray-400 mb-4">
              Handcrafted fashion that combines elegance with individuality. Each piece is uniquely designed and carefully sewn to perfection.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 transition-colors">
                <Facebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 transition-colors">
                <Instagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 transition-colors">
                <Twitter />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
              <li><Link to="/collections" className="hover:text-primary-500 transition-colors">Collections</Link></li>
              <li><Link to="/news" className="hover:text-primary-500 transition-colors">News & Events</Link></li>
              <li><Link to="/sponsors" className="hover:text-primary-500 transition-colors">Our Sponsors</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-xl mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/size-guide" className="hover:text-primary-500 transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-primary-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-xl mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to receive updates on new collections and exclusive offers.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 bg-secondary-800 border border-secondary-700 rounded focus:outline-none focus:border-primary-500"
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-secondary-800 pt-8 mt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Inesta Mode. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;