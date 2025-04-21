
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '../ui/form';
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SettingsTab = ({ user }) => {
  const { theme } = useTheme();
  const { updateMembership } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Define form schema
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters."
    }),
    email: z.string().email({
      message: "Please enter a valid email address."
    }),
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Form submission handler
  function onSubmit(values) {
    // In a real app, you would update the user profile here
    console.log("Form submitted:", values);
    toast.success("Profile updated successfully!");
  }

  const handleToggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
  };

  const handleToggleMarketingEmails = () => {
    setMarketingEmails(!marketingEmails);
    toast.success(`Marketing emails ${!marketingEmails ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className={`glass-card rounded-xl p-8 ${theme === 'dark' ? 'bg-gray-800/70 text-white' : ''}`}>
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
      
      {/* Profile Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Profile Information</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the email used to login to your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Profile</Button>
          </form>
        </Form>
      </div>

      {/* Notification Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Receive email notifications about your orders and account updates
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={handleToggleEmailNotifications} />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Marketing Emails</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Receive marketing emails about new models and promotions
              </p>
            </div>
            <Switch checked={marketingEmails} onCheckedChange={handleToggleMarketingEmails} />
          </div>
        </div>
      </div>

      {/* Account Preferences */}
      <div>
        <h3 className="text-lg font-medium mb-4">Account Preferences</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Region</h4>
            <div className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {user?.region || 'North America'} (based on your account)
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Membership Level</h4>
            <div className={`p-3 rounded-md mb-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {user?.membershipLevel || 'Standard'} (Current)
            </div>
            
            {user?.membershipLevel !== 'vvip' && (
              <Button 
                onClick={() => {
                  updateMembership('vip');
                  toast.success("Membership upgraded to VIP!");
                }}
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:opacity-90"
              >
                Upgrade Membership
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
