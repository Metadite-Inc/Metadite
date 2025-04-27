
import { CreditCard, Users, AlertTriangle, ShoppingBag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const RecentActivity = () => {
  const { theme } = useTheme();
  
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <button className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        <ActivityItem
          icon={<CreditCard className="h-5 w-5 text-green-500" />}
          bgColor="bg-green-100"
          title="New subscription"
          description="User emma@example.com purchased a VIP subscription"
          time="10 minutes ago"
        />
        
        <ActivityItem
          icon={<Users className="h-5 w-5 text-orange-500" />}
          bgColor="bg-orange-100"
          title="New moderator"
          description="Added sarah.moderator@metadite.com as a moderator"
          time="2 hours ago"
        />
        
        <ActivityItem
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
          bgColor="bg-red-100"
          title="Message flagged"
          description="The system flagged a potentially inappropriate message"
          time="5 hours ago"
        />
        
        <ActivityItem
          icon={<ShoppingBag className="h-5 w-5 text-blue-500" />}
          bgColor="bg-blue-100"
          title="New order"
          description="User john@example.com purchased Sophia Elegance model"
          time="1 day ago"
        />
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  bgColor: string;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({ icon, bgColor, title, description, time }: ActivityItemProps) => (
  <div className="flex items-start">
    <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-4 flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

export default RecentActivity;
