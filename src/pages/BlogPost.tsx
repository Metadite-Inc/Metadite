import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { blogApi } from '../lib/api/blog_api';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { 
  Calendar, 
  User, 
  Eye, 
  Tag, 
  ArrowLeft,
  Share2,
  BookOpen,
  Clock,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogPost = () => {
  const { slug } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const postData = await blogApi.getBlogPostBySlug(slug);
      setPost(postData);
      
      // Fetch related posts
      const related = await blogApi.getRelatedPosts(postData.id, 3);
      setRelatedPosts(related);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setError('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.excerpt || '';
    
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading blog post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/blog')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/blog')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-4">
            {post.is_featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                Featured
              </Badge>
            )}
            {post.category && (
              <Badge variant="outline" className="border-purple-400 text-purple-400">
                {post.category}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.view_count} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatReadingTime(post.content)} min read</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-400">Share:</span>
            <button
              onClick={() => sharePost('facebook')}
              className="px-4 py-2 rounded-md flex items-center justify-center transition-colors"
              style={{ backgroundColor: '#1877F2', color: 'white' }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#166FE5'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#1877F2'}
            >
              <Facebook className="h-4 w-4" />
              <span className="ml-2">Facebook</span>
            </button>
            <button
              onClick={() => sharePost('twitter')}
              className="px-4 py-2 rounded-md flex items-center justify-center transition-colors"
              style={{ backgroundColor: '#000000', color: 'white' }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#374151'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#000000'}
            >
              <Twitter className="h-4 w-4" />
              <span className="ml-2">X</span>
            </button>
            <button
              onClick={() => sharePost('linkedin')}
              className="px-4 py-2 rounded-md flex items-center justify-center transition-colors"
              style={{ backgroundColor: '#0A66C2', color: 'white' }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#004182'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0A66C2'}
            >
              <Linkedin className="h-4 w-4" />
              <span className="ml-2">LinkedIn</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
              <span className="ml-2">Copy Link</span>
            </Button>
          </div>

          <Separator className="bg-white/20" />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* Tags */}
        {post.tags && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.split(',').map((tag, index) => (
                <Badge key={index} variant="outline" className="border-purple-400 text-purple-400">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <Separator className="bg-white/20 mb-8" />
            
            <h2 className="text-2xl font-bold text-white mb-6">Related Posts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                  {relatedPost.featured_image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white hover:text-purple-300 transition-colors">
                      <Link to={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{relatedPost.author_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
