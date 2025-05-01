
import React, { useState } from 'react';
import { FileText, Info, Truck, Star, ShieldCheck, Package, Clock, User } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import ReviewForm from './ReviewForm';

const ModelTabs = ({ model, onReviewSubmitted }) => {
  const [activeTab, setActiveTab] = useState('description');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-8">
      <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-x-auto`}>
        <button
          onClick={() => setActiveTab('description')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'description'
              ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
              : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
          }`}
        >
          <FileText className="h-4 w-4 inline-block mr-2" />
          Description
        </button>
        <button
          onClick={() => setActiveTab('specifications')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'specifications'
              ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
              : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
          }`}
        >
          <Info className="h-4 w-4 inline-block mr-2" />
          Specifications
        </button>
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'shipping'
              ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
              : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
          }`}
        >
          <Truck className="h-4 w-4 inline-block mr-2" />
          Shipping
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 text-sm font-medium ${
            activeTab === 'reviews'
              ? `${isDark ? 'bg-gray-800' : 'bg-white'} text-metadite-primary border-b-2 border-metadite-primary`
              : `${isDark ? 'text-gray-300 hover:text-metadite-primary' : 'text-gray-600 hover:text-metadite-primary'}`
          }`}
        >
          <Star className="h-4 w-4 inline-block mr-2" />
          Reviews
        </button>
      </div>
      
      <div className={`p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Product Description</h3>
            <p className={`mb-4 ${isDark ? 'text-gray-300' : ''}`}>{model.longDescription}</p>
            <p className={isDark ? 'text-gray-300' : ''}>{model.detailedDescription}</p>
          </div>
        )}
        
        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {model.specifications.map((spec, index) => (
                <div key={index} className={`flex ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'} pb-2`}>
                  <span className={`font-medium w-1/3 ${isDark ? 'text-gray-300' : ''}`}>{spec.name}:</span>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} w-2/3`}>{spec.value}</span>
                </div>
              ))}
            </div>
            
            <div className={`flex items-center mt-6 p-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg`}>
              <ShieldCheck className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} mr-3`} />
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                All our products come with a 1-year warranty against manufacturing defects.
              </p>
            </div>
          </div>
        )}
        
        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Shipping Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}>
                <div className="flex items-center mb-3">
                  <Package className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                  <h4 className={`font-medium ${isDark ? 'text-white' : ''}`}>Package Details</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Dimensions:</span>
                    <span className={isDark ? 'text-gray-300' : ''}>{model.shippingInfo.dimensions}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Weight:</span>
                    <span className={isDark ? 'text-gray-300' : ''}>{model.shippingInfo.weight}</span>
                  </p>
                </div>
              </div>
              
              <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}>
                <div className="flex items-center mb-3">
                  <Clock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'} mr-2`} />
                  <h4 className={`font-medium ${isDark ? 'text-white' : ''}`}>Processing Time</h4>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>
                  Orders are typically processed within {model.shippingInfo.handlingTime} before shipping.
                </p>
              </div>
            </div>
            
            <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : ''}`}>Shipping Options</h4>
            <div className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden mb-6`}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Method</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Estimated Delivery</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Cost</th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {model.shippingInfo.shippingOptions.map((option, index) => (
                    <tr key={index}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : ''}`}>{option.method}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{option.time}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>${option.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={isDark ? 'bg-gray-700 p-4 rounded-lg' : 'bg-gray-50 p-4 rounded-lg'}>
              <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : ''}`}>Special Notes</h4>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{model.shippingInfo.specialNotes}</p>
            </div>
          </div>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>Customer Reviews</h3>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(model.rating) ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className={`text-lg font-medium ${isDark ? 'text-white' : ''}`}>{model.rating}</span>
                <span className={isDark ? 'text-gray-400 ml-1' : 'text-gray-500 ml-1'}>({model.reviews} reviews)</span>
              </div>
            </div>

            {/* Add review section */}
            <div className={`mb-8 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-8`}>
              <h4 className={`text-md font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Write a Review</h4>
              <ReviewForm modelId={model.id} onReviewSubmitted={onReviewSubmitted} />
            </div>
            
            <div className="space-y-6">
              {model.customerReviews.map((review, index) => (
                <div key={index} className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'} pb-6 last:border-b-0`}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mr-3`}>
                        <User className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </div>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{review.date}</span>
                  </div>
                  
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTabs;
