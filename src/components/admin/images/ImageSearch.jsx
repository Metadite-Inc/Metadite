import React from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ImageSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedModel, 
  handleModelChange,
  models 
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Select
        value={selectedModel}
        onValueChange={handleModelChange}
      >
        <SelectTrigger className="w-40 bg-white">
          <SelectValue placeholder="Filter by model" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value={null}>All Models</SelectItem>
          {models.map(model => (
            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative">
        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
        />
      </div>
    </div>
  );
};

export default ImageSearch;
