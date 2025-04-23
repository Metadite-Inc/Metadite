import { apiService } from '../../../lib/api';

// Fetch model details by ID
export const getModelData = async (id) => {
  try {
    const model = await apiService.getModelDetails(id);
    return model;
  } catch (error) {
    console.error(`Failed to fetch model data for ID ${id}:`, error);
    return null;
  }
};

// Fetch related models based on category
export const getRelatedModels = async (currentModelId, category) => {
  try {
    const relatedModels = await apiService.getRelatedModels(currentModelId, category);
    return relatedModels;
  } catch (error) {
    console.error(`Failed to fetch related models for category ${category}:`, error);
    return [];
  }
};
