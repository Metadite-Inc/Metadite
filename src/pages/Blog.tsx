import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { blogApi } from '../lib/api/blog_api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Tag, 
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [postsPerPage] = useState(9);

  // Get URL parameters
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setCurrentPage(page);
    setSearchTerm(search);
    setSelectedCategory(category);
  }, [page, search, category]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getBlogPosts({
        page: currentPage,
        per_page: postsPerPage,
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
      });
      
      setPosts(response.posts);
      setTotalPages(response.total_pages);
      setTotalPosts(response.total);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await blogApi.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const tagsData = await blogApi.getTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    params.set('page', '1');
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (newCategory) params.set('category', newCategory);
    params.set('page', '1');
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    params.set('page', newPage.toString());
    setSearchParams(params);
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const sharePost = (platform: string, post: any) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    const title = post.title || '';
    const text = post.excerpt || '';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async (post: any) => {
    try {
      const url = `${window.location.origin}/blog/${post.slug}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-metadite-light to-white'
      }`}>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-white' : 'border-metadite-primary'} mx-auto mb-4`}></div>
            <p className={isDark ? 'text-white' : 'text-gray-900'}>Loading blog posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
      : 'bg-gradient-to-br from-metadite-light to-white'
    }`}>
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Blog
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover the latest insights, tips, and stories from our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDark 
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <Button type="submit" className="bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:from-metadite-primary/90 hover:to-metadite-secondary/90">
              Search
            </Button>
          </form>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('')}
                className={selectedCategory === '' 
                  ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:from-metadite-primary/90 hover:to-metadite-secondary/90'
                  : isDark 
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => handleCategoryChange(category)}
                  className={selectedCategory === category 
                    ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:from-metadite-primary/90 hover:to-metadite-secondary/90'
                    : isDark 
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <Card key={post.id} className={`${isDark 
                  ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                  : 'bg-white border-gray-200 hover:shadow-lg'
                } transition-all duration-300`}>
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {post.is_featured && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          Featured
                        </Badge>
                      )}
                      {post.category && (
                        <Badge variant="outline" className={`${isDark 
                          ? 'border-metadite-primary text-metadite-primary' 
                          : 'border-metadite-primary text-metadite-primary'
                        }`}>
                          {post.category}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className={`${isDark ? 'text-white hover:text-metadite-primary' : 'text-gray-900 hover:text-metadite-primary'} transition-colors`}>
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {post.excerpt || truncateText(post.content, 150)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex items-center justify-between text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{post.view_count}</span>
                      </div>
                    </div>
                    <div className={`flex items-center justify-between text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-metadite-primary hover:text-metadite-secondary transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                    
                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Share:</span>
                      <button
                        onClick={() => sharePost('facebook', post)}
                        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#1877F2', color: 'white' }}
                        onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#166FE5'}
                        onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1877F2'}
                      >
                        <Facebook className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => sharePost('twitter', post)}
                        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#000000', color: 'white' }}
                        onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#374151'}
                        onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#000000'}
                      >
                        <Twitter className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => sharePost('linkedin', post)}
                        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#0A66C2', color: 'white' }}
                        onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#004182'}
                        onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0A66C2'}
                      >
                        <Linkedin className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(post)}
                        className="h-8 w-8 p-0 rounded-md flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#4B5563', color: 'white' }}
                        onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#374151'}
                        onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#4B5563'}
                      >
                        <Share2 className="h-3 w-3" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={isDark 
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum 
                          ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary' 
                          : isDark 
                            ? 'border-white/20 text-white hover:bg-white/10'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={isDark 
                    ? 'border-white/20 text-white hover:bg-white/10'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <BookOpen className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No blog posts found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search criteria or browse all posts.'
                : 'Check back soon for new content!'
              }
            </p>
          </div>
        )}

        {/* Results Summary */}
        {posts.length > 0 && (
          <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
