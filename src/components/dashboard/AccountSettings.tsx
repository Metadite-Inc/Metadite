
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const AccountSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
      await refreshUser();
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={user?.full_name || ''}
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={user?.region || ''}
              placeholder="Enter your region"
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Membership Level</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current plan: <span className="font-semibold capitalize">{user?.membershipLevel || 'Standard'}</span>
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/upgrade">Upgrade Plan</a>
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
