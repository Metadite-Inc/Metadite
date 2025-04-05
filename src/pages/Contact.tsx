
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to a server
    console.log('Form submitted:', formData);
    
    toast.success('Message sent!', {
      description: 'We will get back to you shortly.',
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Contact Us</h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Have questions or need assistance? We're here to help. Reach out to us using any of the methods below.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className={`hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-metadite-light'} p-4 rounded-full mb-4`}>
                  <Mail className="h-8 w-8 text-metadite-primary" />
                </div>
                <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Email Us</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Our friendly team is here to help.</p>
                <a href="mailto:support@metadite.com" className="text-metadite-primary hover:underline">
                  support@metadite.com
                </a>
              </CardContent>
            </Card>
            
            <Card className={`hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-metadite-light'} p-4 rounded-full mb-4`}>
                  <Phone className="h-8 w-8 text-metadite-primary" />
                </div>
                <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Call Us</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+1-555-123-4567" className="text-metadite-primary hover:underline">
                  +1 (555) 123-4567
                </a>
              </CardContent>
            </Card>
            
            <Card className={`hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-metadite-light'} p-4 rounded-full mb-4`}>
                  <MapPin className="h-8 w-8 text-metadite-primary" />
                </div>
                <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Visit Us</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Come say hello at our office.</p>
                <address className="not-italic text-metadite-primary">
                  123 Metadite Way<br />
                  San Francisco, CA 94103
                </address>
              </CardContent>
            </Card>
          </div>

          <br /><br />
          
          <div className={`glass-card rounded-2xl overflow-hidden shadow-xl max-w-3xl mx-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
            <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Send us a Message</h2>
              <p className="opacity-80">Fill out the form below to get in touch with us</p>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    required
                    className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
                >
                  <span>Send Message</span>
                  <Send className="ml-2 h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-16">
            <Separator className={`mb-8 ${theme === 'dark' ? 'bg-gray-700' : ''}`} />
            <h2 className={`text-2xl font-bold text-center mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className={`glass-card p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>What are your business hours?</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Our customer support team is available Monday through Friday, from 8am to 5pm Pacific Time.</p>
              </div>
              
              <div className={`glass-card p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>How quickly can I expect a response?</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>We typically respond to all inquiries within 24 hours during business days.</p>
              </div>
              
              <div className={`glass-card p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Do you offer technical support?</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Yes, our technical support team is available to help with any issues you may encounter while using our services.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
