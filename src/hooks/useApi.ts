
import { useState, useEffect } from 'react';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for API calls with loading and error handling
 * @param fetchFn - The async function to fetch data
 * @param dependencies - Optional dependency array to control when to refetch
 * @returns ApiState with data, loading state, and error
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await fetchFn();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      console.error("API Error:", error);
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = async () => {
    await fetchData();
  };

  return { ...state, refetch };
}
