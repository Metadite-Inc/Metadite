import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, CreditCardIcon, StarIcon, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createNowpaymentsSubscriptionInvoice } from '../lib/api/payment_api';

const tiers = [
  {
    name: 'Standard',
    price: 15,
    description: 'Perfect for casual users',
    features: [
      '10 messages',// per day',
      'Access to all models',
      'One photo',// per model',
      'Email support',
    ],
    recommended: false,
    level: 'standard',
    icon: <ShieldCheck className="h-10 w-10 text-blue-500" />,
    color: 'blue'
  },
  {
    name: 'VIP',
    price: 20,
    description: 'Enhanced experience for enthusiasts',
    features: [
      '30 messages',// per day',
      'Access to all models',
      'Access to 1 exclusive video',
      '3 photos',// per model',
      'Priority email support',
    ],
    recommended: true,
    level: 'vip',
    icon: <StarIcon className="h-10 w-10 text-amber-500" />,
    color: 'amber'
  },
  {
    name: 'VVIP',
    price: 50,
    description: 'Ultimate experience for collectors',
    features: [
      'Unlimited messages',
      'Access to all models',
      'Access to 2 premium videos',
      'Access to limited edition content',
      'Chances of winning collectible items',
      '5 photos',// per model',
      '24/7 priority support',
    ],
    recommended: false,
    level: 'vvip',
    icon: <Zap className="h-10 w-10 text-purple-500" />,
    color: 'purple'
  },
];

const Upgrade: React.FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { user, updateMembership } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();



  // Navigate to the dedicated subscription checkout route with plan info
  const handleUpgrade = (tierLevel: 'standard' | 'vip' | 'vvip', price: number) => {
    navigate('/subscription-checkout', { state: { tierLevel, price } });
  };

  const getCurrentPlan = () => {
    return user?.membership_level || 'free';
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className={`flex-1 container mx-auto px-4 py-24 ${
        theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : ''
      }`}>
        <div className="text-center mb-12">
          <br /> <br /><br /> <br />
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-transparent bg-clip-text">
            Choose Your Membership
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan to enhance your Metadite experience and unlock exclusive content.
          </p>
          {currentPlan && (
            <div className="mt-4 inline-block bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium dark:text-gray-200">
              Your current plan:
              <span className="font-bold italic text-green-500 uppercase">
                <Badge className={`text-${currentPlan === 'vvip' ? 'purple' : currentPlan === 'vip' ? 'amber' : 'green'}-500 bg-${currentPlan === 'vvip' ? 'purple' : currentPlan === 'vip' ? 'amber' : 'green'}-100 dark:bg-${currentPlan === 'vvip' ? 'purple' : currentPlan === 'vip' ? 'amber' : 'green'}-900/20`}>
                  {currentPlan}
                </Badge>
              </span>
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${
                tier.recommended ? 'border-metadite-primary' : currentPlan === tier.level ? 'border-green-500' : ''
              } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            >
              {tier.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  Recommended
                </div>
              )}
              
              {currentPlan === tier.level && (
                <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 rounded-br-lg text-sm font-bold">
                  Current Plan
                </div>
              )}
              
              <CardHeader className="pb-0">
                <div className="flex justify-center mb-4">
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-center">
                  {tier.name}
                </CardTitle>
                <CardDescription className="text-center text-base">{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-8">
                  <span className="text-5xl font-bold">${tier.price}</span>
                  {/*<span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>*/}
                </div>
                
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className={`h-5 w-5 text-${tier.color}-500 shrink-0 mt-0.5 mr-3`} />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-4">
                <Button 
                  className={`w-full ${
                    tier.recommended 
                      ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:opacity-90' 
                      : `border-2 border-${tier.color}-500 ${currentPlan === tier.level ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' : ''}`
                  }`}
                  variant={tier.recommended ? "default" : currentPlan === tier.level ? "outline" : "outline"}
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
                    <span className="flex items-center justify-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Get {tier.name}
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <br /> <br /><br />
      </main>
      
      <Footer />
    </div>
  );
};

export default Upgrade;
