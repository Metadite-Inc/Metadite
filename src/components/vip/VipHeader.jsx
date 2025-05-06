
import { Video } from 'lucide-react';

const VipHeader = ({ filteredVideosCount }) => {
  return (
    <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
            <Video className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">VIP Exclusive Videos</h1>
            <p className="opacity-80">Access to premium content for VIP members only</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
            {filteredVideosCount} Videos
          </span>
        </div>
      </div>
    </div>
  );
};

export default VipHeader;
