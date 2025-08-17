import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { blogApi } from '../../lib/api/blog_api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch.tsx';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Search,
  Filter,
  RefreshCw,
  BookOpen,
  Star,
  MoreHorizontal,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const BlogTab = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postsPerPage] = useState(10);
  
  // Predefined categories
  const predefinedCategories = [
    'Technology',
    'Business',
    'Marketing',
    'Design',
    'Development',
    'Tutorial',
    'News',
    'Tips & Tricks',
    'Case Study',
    'Industry Insights',
    'Product Updates',
    'Company News'
  ];
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    is_published: false,
    is_featured: false,
    tags: '',
    category: '',
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchPosts = async () => {
    try {
      console.log('Fetching blog posts...');
      const response = await blogApi.getAdminBlogPosts({
        page: currentPage,
        per_page: postsPerPage,
        search: searchTerm || undefined,
        status_filter: filterStatus,
      });
      
      console.log('Blog posts response:', response);
      
      setPosts(response.posts);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      // Generate slug if not provided
      if (!formData.slug) {
        formData.slug = blogApi.generateSlug(formData.title);
      }
      
      await blogApi.createBlogPost(formData);
      setCreateModalOpen(false);
      resetForm();
      fetchPosts();
      toast.success('Blog post created successfully!');
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Failed to create blog post');
    }
  };

  const handleUpdatePost = async () => {
    try {
      if (!selectedPost) return;
      
      // Generate slug if title changed and slug is empty
      if (formData.title !== selectedPost.title && !formData.slug) {
        formData.slug = blogApi.generateSlug(formData.title);
      }
      
      await blogApi.updateBlogPost(selectedPost.id, formData);
      setEditModalOpen(false);
      resetForm();
      fetchPosts();
      toast.success('Blog post updated successfully!');
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    }
  };

  const handleDeletePost = async () => {
    try {
      if (!selectedPost) return;
      
      await blogApi.deleteBlogPost(selectedPost.id);
      setDeleteModalOpen(false);
      setSelectedPost(null);
      fetchPosts();
      toast.success('Blog post deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const openEditModal = (post) => {
    console.log('Opening edit modal for post:', post);
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      is_published: post.is_published,
      is_featured: post.is_featured,
      tags: post.tags || '',
      category: post.category || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || ''
    });
    setEditModalOpen(true);
    console.log('Edit modal state set to true');
  };

  const openDeleteModal = (post) => {
    console.log('Opening delete modal for post:', post);
    setSelectedPost(post);
    setDeleteModalOpen(true);
    console.log('Delete modal state set to true');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      is_published: false,
      is_featured: false,
      tags: '',
      category: '',
      meta_title: '',
      meta_description: ''
    });
    setSelectedPost(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="text-center py-8">
          <p className="text-gray-400">Admin access required to manage blog posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Blog Management</h2>
          <p className="text-gray-300">
            Create, edit, and manage blog posts
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              console.log('New Post button clicked');
              setCreateModalOpen(true);
            }}
            className="bg-metadite-accent hover:bg-metadite-accent/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
          
          <Button
            onClick={() => {
              console.log('Refresh button clicked');
              setLoading(true);
              setCurrentPage(1);
              setSearchTerm('');
              setFilterStatus('all');
              fetchPosts();
            }}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}>
            <TableRow>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Title</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Author</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Status</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Category</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Views</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Created</TableHead>
              <TableHead className={theme === 'dark' ? 'text-gray-300' : ''}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                    <span className="text-gray-400">Loading blog posts...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
            posts.map((post) => (
              <TableRow 
                key={post.id}
                className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/30' : 'hover:bg-gray-50'}
              >
                <TableCell className="max-w-xs">
                  <div>
                    <div className="font-medium text-white mb-1">
                      {truncateText(post.title, 50)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {truncateText(post.excerpt || post.content, 80)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {post.author_name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={post.is_published ? "default" : "secondary"}
                      className={post.is_published ? "bg-green-500" : "bg-gray-500"}
                    >
                      {post.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    {post.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {post.category || '-'}
                </TableCell>
                <TableCell className="text-gray-300">
                  {post.view_count}
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatDate(post.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Edit button clicked for post:', post.id);
                        openEditModal(post);
                      }}
                      className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('Delete button clicked for post:', post.id);
                        openDeleteModal(post);
                      }}
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'No posts match your filters' 
              : 'No blog posts found. Create your first post!'
            }
          </p>
        </div>
      )}

      {/* Create Post Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setCreateModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg p-4 max-w-4xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Blog Post
              </h3>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter post title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="Auto-generated from title"
                  />
                </div>
                
                                 <div>
                   <Label htmlFor="category">Category</Label>
                   <Select 
                     value={formData.category} 
                     onValueChange={(value) => setFormData({...formData, category: value})}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select a category" />
                     </SelectTrigger>
                     <SelectContent>
                       {predefinedCategories.map((category) => (
                         <SelectItem key={category} value={category}>
                           {category}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="Enter tags (comma-separated)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                    placeholder="SEO meta title"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  placeholder="SEO meta description"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your blog post content here..."
                  rows={10}
                />
              </div>
              
                             <div className="flex items-center space-x-4">
                                   <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) => {
                        console.log('Published checkbox changed to:', e.target.checked);
                        setFormData({...formData, is_published: e.target.checked});
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_published">Published</Label>
                    <span className="text-sm text-gray-500">(Visible to public)</span>
                    <span className="text-xs text-gray-400 ml-2">Current: {formData.is_published ? 'ON' : 'OFF'}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Toggle published button clicked');
                        setFormData({...formData, is_published: !formData.is_published});
                      }}
                      className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded"
                    >
                      Toggle
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => {
                        console.log('Featured checkbox changed to:', e.target.checked);
                        setFormData({...formData, is_featured: e.target.checked});
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                    <span className="text-sm text-gray-500">(Highlighted on homepage)</span>
                    <span className="text-xs text-gray-400 ml-2">Current: {formData.is_featured ? 'ON' : 'OFF'}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Toggle featured button clicked');
                        setFormData({...formData, is_featured: !formData.is_featured});
                      }}
                      className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded"
                    >
                      Toggle
                    </button>
                  </div>
               </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePost} 
                disabled={!formData.title || !formData.content}
                className="bg-metadite-accent hover:bg-metadite-accent/90"
              >
                Create Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setEditModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg p-6 max-w-4xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Blog Post
              </h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter post title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="Auto-generated from title"
                  />
                </div>
                
                                 <div>
                   <Label htmlFor="edit-category">Category</Label>
                   <Select 
                     value={formData.category} 
                     onValueChange={(value) => setFormData({...formData, category: value})}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select a category" />
                     </SelectTrigger>
                     <SelectContent>
                       {predefinedCategories.map((category) => (
                         <SelectItem key={category} value={category}>
                           {category}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                
                <div>
                  <Label htmlFor="edit-tags">Tags</Label>
                  <Input
                    id="edit-tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="Enter tags (comma-separated)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-featured_image">Featured Image URL</Label>
                  <Input
                    id="edit-featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-meta_title">Meta Title</Label>
                  <Input
                    id="edit-meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                    placeholder="SEO meta title"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-meta_description">Meta Description</Label>
                <Textarea
                  id="edit-meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  placeholder="SEO meta description"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your blog post content here..."
                  rows={10}
                />
              </div>
              
                             <div className="flex items-center space-x-4">
                                   <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-is_published"
                      checked={formData.is_published}
                      onChange={(e) => {
                        console.log('Edit Published checkbox changed to:', e.target.checked);
                        setFormData({...formData, is_published: e.target.checked});
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="edit-is_published">Published</Label>
                    <span className="text-sm text-gray-500">(Visible to public)</span>
                    <span className="text-xs text-gray-400 ml-2">Current: {formData.is_published ? 'ON' : 'OFF'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => {
                        console.log('Edit Featured checkbox changed to:', e.target.checked);
                        setFormData({...formData, is_featured: e.target.checked});
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="edit-is_featured">Featured</Label>
                    <span className="text-sm text-gray-500">(Highlighted on homepage)</span>
                    <span className="text-xs text-gray-400 ml-2">Current: {formData.is_featured ? 'ON' : 'OFF'}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdatePost} 
                disabled={!formData.title || !formData.content}
                className="bg-metadite-accent hover:bg-metadite-accent/90"
              >
                Update Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setDeleteModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl mt-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Blog Post
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeletePost}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTab;
