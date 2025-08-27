import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ensures consistent ID type conversion
 * Converts string or number IDs to numbers for API calls
 * @param id - The ID to convert (string | number)
 * @returns number - The converted ID
 */
export const ensureNumberId = (id: string | number): number => {
  if (typeof id === 'number') {
    return id;
  }
  if (typeof id === 'string') {
    const converted = Number(id);
    if (isNaN(converted)) {
      throw new Error(`Invalid ID format: ${id}`);
    }
    return converted;
  }
  throw new Error(`Invalid ID type: ${typeof id}`);
};

/**
 * Validates that an ID is a positive number
 * @param id - The ID to validate
 * @returns boolean - True if valid
 */
export const isValidId = (id: string | number): boolean => {
  try {
    const numId = ensureNumberId(id);
    return numId > 0;
  } catch {
    return false;
  }
};
// Region detection utility
export const detectUserRegion = async (): Promise<string> => {
  try {
    // Primary method: Use browser locale (no CORS issues)
    const browserLocale = navigator.language || navigator.languages?.[0] || 'en-US';
    const countryCode = browserLocale.split('-')[1]?.toLowerCase();
    
    if (countryCode) {
      const regionMapping: { [key: string]: string } = {
        'us': 'usa',
        'ca': 'canada',
        'mx': 'mexico',
        'gb': 'uk',
        'au': 'australia',
        'nz': 'new_zealand',
        // EU countries
        'de': 'eu', 'fr': 'eu', 'it': 'eu', 'es': 'eu', 'nl': 'eu', 'be': 'eu',
        'at': 'eu', 'se': 'eu', 'dk': 'eu', 'fi': 'eu', 'no': 'eu', 'ch': 'eu',
        'ie': 'eu', 'pt': 'eu', 'gr': 'eu', 'pl': 'eu', 'cz': 'eu', 'hu': 'eu',
        'ro': 'eu', 'bg': 'eu', 'hr': 'eu', 'sk': 'eu', 'si': 'eu', 'lt': 'eu',
        'lv': 'eu', 'ee': 'eu', 'cy': 'eu', 'mt': 'eu', 'lu': 'eu'
      };
      
      const detectedRegion = regionMapping[countryCode];
      if (detectedRegion) {
        console.log('Detected region from browser locale:', detectedRegion);
        return detectedRegion;
      }
    }
    
    // Fallback: Try external API (with better error handling)
    try {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.country_code?.toLowerCase();
        
        const regionMapping: { [key: string]: string } = {
          'us': 'usa',
          'ca': 'canada',
          'mx': 'mexico',
          'gb': 'uk',
          'au': 'australia',
          'nz': 'new_zealand',
          // EU countries
          'de': 'eu', 'fr': 'eu', 'it': 'eu', 'es': 'eu', 'nl': 'eu', 'be': 'eu',
          'at': 'eu', 'se': 'eu', 'dk': 'eu', 'fi': 'eu', 'no': 'eu', 'ch': 'eu',
          'ie': 'eu', 'pt': 'eu', 'gr': 'eu', 'pl': 'eu', 'cz': 'eu', 'hu': 'eu',
          'ro': 'eu', 'bg': 'eu', 'hr': 'eu', 'sk': 'eu', 'si': 'eu', 'lt': 'eu',
          'lv': 'eu', 'ee': 'eu', 'cy': 'eu', 'mt': 'eu', 'lu': 'eu'
        };
        
        const detectedRegion = regionMapping[countryCode];
        if (detectedRegion) {
          console.log('Detected region from IP API:', detectedRegion);
          return detectedRegion;
        }
      }
    } catch (apiError) {
      console.warn('IP API failed, using browser locale fallback:', apiError);
    }
    
    // Final fallback: return default region
    console.log('Using default region: usa');
    return 'usa';
  } catch (error) {
    console.error('Error in region detection:', error);
    return 'usa'; // Default to USA on any error
  }
};

// Region name mapping for display
export const getRegionDisplayName = (regionCode: string): string => {
  const regionNames: { [key: string]: string } = {
    'usa': 'USA',
    'canada': 'Canada',
    'mexico': 'Mexico',
    'uk': 'UK',
    'eu': 'EU',
    'australia': 'Australia',
    'new_zealand': 'New Zealand'
  };
  
  return regionNames[regionCode] || regionCode;
};
