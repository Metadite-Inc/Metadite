import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: number;
  author_name: string;
  author_email: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  tags?: string;
  category?: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at?: string;
}

interface BlogPostCreate {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  is_published: boolean;
  is_featured: boolean;
  tags?: string;
  category?: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
}

interface BlogPostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  is_published?: boolean;
  is_featured?: boolean;
  tags?: string;
  category?: string;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
}

interface BlogPostList {
  posts: BlogPost[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

class BlogApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const token = localStorage.getItem('access_token');
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Blog API error:', error);
      throw error;
    }
  }

  // Get all blog posts with pagination and filtering (public - published only)
  async getBlogPosts(params: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
    featured_only?: boolean;
  } = {}): Promise<BlogPostList> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.featured_only) searchParams.append('featured_only', 'true');

    const queryString = searchParams.toString();
    const endpoint = `/api/blog/?${queryString}`;
    
    return this.request<BlogPostList>(endpoint);
  }

  // Get all blog posts for admin management (both published and unpublished)
  async getAdminBlogPosts(params: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
    status_filter?: 'published' | 'draft' | 'featured' | 'all';
  } = {}): Promise<BlogPostList> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.status_filter) searchParams.append('status_filter', params.status_filter);

    const queryString = searchParams.toString();
    const endpoint = `/api/blog/admin/all?${queryString}`;
    
    return this.request<BlogPostList>(endpoint);
  }

  // Get a specific blog post by ID
  async getBlogPost(postId: number): Promise<BlogPost> {
    return this.request<BlogPost>(`/api/blog/${postId}`);
  }

  // Get a specific blog post by slug
  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/api/blog/slug/${slug}`);
  }

  // Create a new blog post (admin only)
  async createBlogPost(postData: BlogPostCreate): Promise<BlogPost> {
    try {
      const result = await this.request<BlogPost>('/api/blog/', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      
      toast.success('Blog post created successfully!');
      return result;
    } catch (error: any) {
      toast.error('Failed to create blog post');
      throw error;
    }
  }

  // Update a blog post (admin only)
  async updateBlogPost(postId: number, postData: BlogPostUpdate): Promise<BlogPost> {
    try {
      const result = await this.request<BlogPost>(`/api/blog/${postId}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
      });
      
      toast.success('Blog post updated successfully!');
      return result;
    } catch (error: any) {
      toast.error('Failed to update blog post');
      throw error;
    }
  }

  // Delete a blog post (admin only)
  async deleteBlogPost(postId: number): Promise<void> {
    try {
      await this.request(`/api/blog/${postId}`, {
        method: 'DELETE',
      });
      
      toast.success('Blog post deleted successfully!');
    } catch (error: any) {
      toast.error('Failed to delete blog post');
      throw error;
    }
  }

  // Get related blog posts
  async getRelatedPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    return this.request<BlogPost[]>(`/api/blog/${postId}/related?limit=${limit}`);
  }

  // Get all categories
  async getCategories(): Promise<string[]> {
    const result = await this.request<{ categories: string[] }>('/api/blog/categories/list');
    return result.categories;
  }

  // Get all tags
  async getTags(): Promise<string[]> {
    const result = await this.request<{ tags: string[] }>('/api/blog/tags/list');
    return result.tags;
  }

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[-\s]+/g, '-')
      .trim();
  }
}

export const blogApi = new BlogApiService();
