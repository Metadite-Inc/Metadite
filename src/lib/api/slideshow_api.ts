/***
 * 
 * backend apis

//create a slideshow image or video
curl -X 'POST' \
  'http://127.0.0.1:8000/api/slideshow/upload/slideshow' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGcwZSIvaR6kxPuv-QmWtvDBnLKeSrfE' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@Viva La Vida - Performed by Arís Celebration Choir.mp4;type=video/mp4' \
  -F 'caption=string' \
  -F 'is_video=true'

// fetch slideshows
curl -X 'GET' \
  'http://127.0.0.1:8000/api/slideshow/slideshows?skip=0&limit=50' \
  -H 'accept: application/json'

// delete slideshow
curl -X 'DELETE' \
  'http://127.0.0.1:8000/api/slideshow/slideshows/2' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsI'
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const slideshowApi = {
  // Fetch slideshow items
  async getSlideshows(skip = 0, limit = 50) {
    const res = await fetch(`${API_BASE}/api/slideshow/slideshows?skip=${skip}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch slideshows');
    const data = await res.json();
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    return Array.isArray(data)
      ? data.map(item => {
          let type = '';
          let url = '';
          if (item.slideshow_image_url) {
            type = 'image';
            url = /^https?:\/\//.test(item.slideshow_image_url)
              ? item.slideshow_image_url
              : `${backendUrl}${item.slideshow_image_url}`;
          } else if (item.slideshow_video_url) {
            type = 'video';
            url = /^https?:\/\//.test(item.slideshow_video_url)
              ? item.slideshow_video_url
              : `${backendUrl}${item.slideshow_video_url}`;
          }
          return {
            id: item.id,
            type,
            url,
            caption: item.slideshow_caption,
            // ...add other fields if needed
          };
        })
      : [];
  },

  // Upload a new slideshow item (image/video)
  async uploadSlideshow({ file, caption = '', is_video = false, token }) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('is_video', is_video ? 'true' : 'false');
    const res = await fetch(`${API_BASE}/api/slideshow/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload slideshow');
    return await res.json();
  },

  // Delete a slideshow item by ID
  async deleteSlideshow(id, token) {
    const res = await fetch(`${API_BASE}/api/slideshow/slideshows/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to delete slideshow');
    return true;
  }
};