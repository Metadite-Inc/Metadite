
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Moderator {
  id: number;
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: number;
  assigned_dolls: number[];
}

interface Model {
  id: number;
  name: string;
  image_url: string;
}

class ModeratorApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

/* backend apis

CRREATE MODERATOR = IMPLEMENTED IN src/lib/api/admin_api
curl -X 'POST' \
  'http://127.0.0.1:8000/api/admin/moderators' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciDN7KvPY' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "full_name": "string",
  "region": "string",
  "role": "user",
  "membership_level": "standard",
  "is_active": true,
  "video_access_count": 0,
  "assigned_dolls": [],
  "password": "string"
}'

ASSIGN A DOLL TO MODERATOR
curl -X 'POST' \
  'http://127.0.0.1:8000/api/moderators/1/dolls/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGo04DN7KvPY' \
  -d ''

GET DOLLS ASSIGNED TO MODERATOR
curl -X 'GET' \
  'http://127.0.0.1:8000/api/moderators/1/dolls' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1'

DELETE MODERATOR
curl -X 'DELETE' \
  'http://127.0.0.1:8000/api/moderators/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1N'

ALLOW MODERATORS TO UPDATE THERE PROFILE
curl -X 'PUT' \
  'http://127.0.0.1:8000/api/moderators/moderators/1' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIstaF0y-eo04DN7KvPY' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "full_name": "string",
  "region": "string",
  "is_active": true,
  "password": "string"
}'

*/

export const moderatorApiService = new ModeratorApiService();


