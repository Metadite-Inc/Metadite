
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Models from "./pages/Models";
import ModelDetail from "./pages/ModelDetail";
import ModelEdit from "./pages/ModelEdit";
import ModelChat from "./pages/ModelChat";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Upgrade from "./pages/Upgrade";
import ChatPage from "./pages/ChatPage";
import Terms from "./pages/Terms";
import OrderDetail from "./pages/OrderDetail";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AgeVerificationGate>
              <AuthProvider>
                <CartProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/underage" element={<UnderAge />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/staff-dashboard" element={<StaffDashboard />} />
                    <Route path="/vip-content" element={<VipContent />} />
                    <Route path="/video/:videoId" element={<VideoPlayer />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/subscription-checkout" element={<SubscriptionCheckout />} />
                    <Route path="/success-subscription" element={<SuccessSubscription />} />
                    <Route path="/cancel-subscription" element={<CancelSubscription />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/cancel" element={<Cancel />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/model/edit/:id" element={<ModelEdit />} />
                    <Route path="/moderator" element={<Moderator />} />
                    <Route path="/models" element={<Models />} />
                    <Route path="/model/:id" element={<ModelDetail />} />
                    <Route path="/model-chat/:id" element={<ModelChat />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/upgrade" element={<Upgrade />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/order/:orderId" element={<OrderDetail />} />
                    <Route path="/chat" element={<ChatPage />} />
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
