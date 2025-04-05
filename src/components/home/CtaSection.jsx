
import { Link } from 'react-router-dom';

const CtaSection = ({ user, hasVipAccess }) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-metadite-primary to-metadite-secondary">
      <div className="container mx-auto max-w-4xl text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Community?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Sign up today and explore our exclusive collection of premium model dolls. VIP members get special access to videos and early releases.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {!user ? (
            <Link 
              to="/login"
              className="bg-white text-metadite-primary px-8 py-3 rounded-lg hover:bg-opacity-90 transition-opacity shadow-lg font-medium"
            >
              Sign Up Now
            </Link>
          ) : !hasVipAccess ? (
            <Link 
              to="/upgrade"
              className="bg-white text-metadite-primary px-8 py-3 rounded-lg hover:bg-opacity-90 transition-opacity shadow-lg font-medium"
            >
              Upgrade to VIP
            </Link>
          ) : null}
          <Link 
            to="/models"
            className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
