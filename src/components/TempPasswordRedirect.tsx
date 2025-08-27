import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TempPasswordRedirectProps {
  message?: string;
}

const TempPasswordRedirect: React.FC<TempPasswordRedirectProps> = ({ message }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show toast notification
    toast.warning(message || "Please change your password immediately for security reasons.");
    
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard?tab=settings');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, message]);

  const handleChangePassword = () => {
    navigate('/dashboard?tab=settings');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-amber-600">⚠️ Temporary Password Detected</CardTitle>
          <CardDescription className="text-center">
            For your security, please change your password immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>You logged in with a temporary password.</p>
            <p>You will be redirected to the account settings page in a few seconds.</p>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={handleChangePassword} className="w-full">
              Change Password Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TempPasswordRedirect;
