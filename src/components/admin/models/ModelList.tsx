
import { Search, Edit, Trash2, PackagePlus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface Model {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  assignedModerator: string;
  image: string;
}

interface ModelListProps {
  models: Model[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ModelList = ({ models, searchTerm, onSearchChange }: ModelListProps) => {
  const { theme } = useTheme();

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold">Manage Models</h2>
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className={`text-left text-gray-500 text-sm 
              ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-50'}`}>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Assigned Moderator</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className={`border-t border-gray-100 transition-colors 
                ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
              >
                <td className="px-6 py-4">
                  <img 
                    src={model.image} 
                    alt={model.name} 
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 font-medium">{model.name}</td>
                <td className="px-6 py-4">${model.price}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    model.category === 'Premium' 
                      ? 'bg-purple-100 text-purple-700' 
                      : model.category === 'Limited Edition'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {model.category}
                  </span>
                </td>
                <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {model.assignedModerator || 'None assigned'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {models.length === 0 && (
        <div className="text-center py-10">
          <PackagePlus className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No models found.</p>
        </div>
      )}
    </div>
  );
};

export default ModelList;
