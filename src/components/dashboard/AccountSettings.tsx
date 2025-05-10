
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Mail, User, MapPin, Lock, CreditCard, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import RegionSelect from '../auth/RegionSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const AccountSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '+1 555-123-4567',
    address: '123 Example St',
    city: 'New York',
    region: 'NY',
    postalCode: '10001',
    country: 'USA'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleRegionChange = (value: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      region: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile logic would go here
    toast.success('Profile updated successfully');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Save password logic would go here
    toast.success('Password updated successfully');
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Save payment logic would go here
    toast.success('Payment information updated successfully');
  };

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      
      <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="security" className="flex items-center"><Lock className="mr-2 h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center"><CreditCard className="mr-2 h-4 w-4" /> Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 555-123-4567"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Example St"
                    value={profile.address}
                    onChange={handleProfileChange}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="New York"
                  value={profile.city}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">State/Region</Label>
                <RegionSelect value={profile.region} onChange={handleRegionChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  placeholder="10001"
                  value={profile.postalCode}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            
            <Button type="submit" className="mt-4">Save Profile</Button>
          </form>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="grid md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button type="submit" className="mt-4">Update Password</Button>
          </form>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <form onSubmit={handleSavePayment} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  type="text"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  type="text"
                  placeholder="123"
                />
              </div>
            </div>
            
            <Button type="submit" className="mt-4">Save Payment Information</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSettings;
