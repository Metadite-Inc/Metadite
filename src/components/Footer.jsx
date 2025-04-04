
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-metadite-dark to-metadite-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Metadite</h3>
            <p className="text-gray-300">Premium model content platform with exclusive access to your favorite models.</p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/models" className="text-gray-300 hover:text-white transition-colors">Models</Link></li>
              <li><Link to="/vip-content" className="text-gray-300 hover:text-white transition-colors">VIP Content</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login / Sign Up</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <p className="text-gray-300">Subscribe to receive updates and special offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-md text-gray-800 w-full focus:outline-none"
              />
              <button className="bg-metadite-accent hover:bg-opacity-90 transition-colors px-4 py-2 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Metadite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
