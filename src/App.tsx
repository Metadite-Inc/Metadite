import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import Index from "./pages/Index";
import AgeVerificationGate from "./components/AgeVerificationGate";
import UnderAge from "./pages/UnderAge";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StaffDashboard from "./pages/StaffDashboard";
import VipContent from "./pages/VipContent";
import VideoPlayer from "./pages/VideoPlayer";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
import SuccessSubscription from "./pages/SuccessSubscription";
import CancelSubscription from "./pages/CancelSubscription";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Admin from "./pages/Admin";
import Moderator from "./pages/Moderator";
import ModeratorAssignments from "./pages/ModeratorAssignments";
import AdminOrders from "./pages/AdminOrders";
import Models from "./pages/Models";
import ModelDetail from "./pages/ModelDetail";
import ModelEdit from "./pages/ModelEdit";
import ModelChat from "./pages/ModelChat";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Upgrade from "./pages/Upgrade";
import ChatPage from "./pages/ChatPage";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import OrderDetail from "./pages/OrderDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import ModeratorChatActivity from './pages/ModeratorChatActivity';
import Help from './pages/Help';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AgeVerificationGate>
              <AuthProvider>
                <CartProvider>
                  <Toaster />
                  <Sonner 
                    position="bottom-center"
                    toastOptions={{
                      duration: 1000,
                      style: {
                        marginBottom: '20px',
                        maxWidth: '90vw',
                        width: 'auto',
                        padding: '8px 16px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/underage" element={<UnderAge />} />
                    <Route path="/login" element={<Login />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/staff-dashboard" 
                      element={
                        <ProtectedRoute roles={['admin', 'moderator']}>
                          <StaffDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/vip-content" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <VipContent />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/video/:videoId" element={<VideoPlayer />} />
                    <Route 
                      path="/cart" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <Cart />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/checkout" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <Checkout />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/subscription-checkout" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <SubscriptionCheckout />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/success-subscription" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <SuccessSubscription />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/cancel-subscription" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <CancelSubscription />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/success" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <Success />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/cancel" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <Cancel />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <Admin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/model/edit/:id" 
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <ModelEdit />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/moderator" 
                      element={
                        <ProtectedRoute roles={['moderator']}>
                          <Moderator />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/moderator-assignments" 
                      element={
                        <ProtectedRoute roles={['admin', 'moderator']}>
                          <ModeratorAssignments />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin-orders" 
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <AdminOrders />
                        </ProtectedRoute>
                      } 
                    />
                    <Route
                      path="/moderator-chat-activity/:moderatorId"
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <ModeratorChatActivity />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/models" element={<Models />} />
                    <Route path="/model/:id" element={<ModelDetail />} />
                    <Route 
                      path="/model-chat/:id" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <ModelChat />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/upgrade" element={<Upgrade />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route 
                      path="/order/:orderId" 
                      element={
                        <ProtectedRoute roles={['user', 'admin']}>
                          <OrderDetail />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/chat" 
                      element={
                        <ProtectedRoute roles={['user']}>
                          <ChatPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/help" element={<Help />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </CartProvider>
              </AuthProvider>
            </AgeVerificationGate>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
