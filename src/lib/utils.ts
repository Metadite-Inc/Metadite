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
