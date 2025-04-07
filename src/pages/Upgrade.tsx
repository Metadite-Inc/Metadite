import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, CreditCardIcon, StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const tiers = [
  {
    name: 'Standard',
    price: 10,
    description: 'Perfect for casual users',
    features: [
      'Access to basic models',
      'Limited collection access',
      'Monthly newsletter',
      'Regular support'
    ],
    recommended: false,
    level: 'standard'
  },
  {
    name: 'VIP',
    price: 20,
    description: 'Enhanced experience for enthusiasts',
    features: [
      'Access to all Standard features',
      'Premium model collection',
      'Early access to new releases',
      'Priority support'
    ],
    recommended: true,
    level: 'vip'
  },
  {
    name: 'VVIP',
    price: 50,
    description: 'Ultimate experience for collectors',
    features: [
      'Access to all VIP features',
      'Exclusive limited-edition models',
      'Custom model requests',
      'Personal concierge service',
      "Quarterly collector's magazine"
    ],
    recommended: false,
    level: 'vvip'
  }
];

const Upgrade: React.FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { user, updateMembership } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleUpgrade = (tierLevel: 'standard' | 'vip' | 'vvip', price: number) => {
    setLoading({ ...loading, [tierLevel]: true });
    
    // Simulate payment processing
    setTimeout(() => {
      // Update user membership level
      updateMembership(tierLevel);
      
      toast.success(`Upgraded to ${tierLevel} tier!`, {
        description: `Your payment of $${price} has been processed successfully.`,
      });
      setLoading({ ...loading, [tierLevel]: false });
      navigate('/dashboard');
    }, 2000);
  };

  const getCurrentPlan = () => {
    return user?.membershipLevel || 'standard';
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <br /> <br /><br /> <br /><br /> <br />
      <main className={`flex-1 container mx-auto px-4 py-12 ${
        theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : ''
      }`}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-transparent bg-clip-text">
            Upgrade Your Experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan to enhance your Metadite collection and unlock exclusive features.
          </p>
          {currentPlan && (
           <div className="mt-4 inline-block bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium dark:text-gray-200">
           Your current plan: <span className="font-bold italic text-green-500 uppercase">{currentPlan}</span>
         </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                tier.recommended ? 'border-metadite-primary ring-2 ring-metadite-primary/20' : ''
              } ${
                currentPlan === tier.level 
                  ? 'bg-blue-400 dark:bg-green-700/70 border-green-400 text-gray-800'
                  : 'bg-gray-400 dark:bg-gray-400 dark:border-gray-700 border-blue-400 text-gray-800 dark:text-gray-400'
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Recommended
                </div>
              )}
              
              {currentPlan === tier.level && (
                <div className="absolute top-0 left-0 bg-blue-500 text-black px-4 py-1 rounded-br-lg text-sm font-bold">
                  Current Plan
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 dark:text-white">
                  {tier.level === 'vvip' && <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                  {tier.name}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold dark:text-white">${tier.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${
                    tier.recommended 
                      ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary' 
                      : ''
                  }`}
                  onClick={() => handleUpgrade(tier.level as 'standard' | 'vip' | 'vvip', tier.price)}
                  disabled={loading[tier.level] || currentPlan === tier.level}
                >
                  {loading[tier.level] ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : currentPlan === tier.level ? (
                    "Current Plan"
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Upgrade Now
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            All plans include a 14-day money-back guarantee. You can cancel or change your subscription at any time.
            Need help choosing the right plan? <a href="/contact" className="text-metadite-primary hover:underline">Contact our team</a>.
          </p>
          <br />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upgrade;
