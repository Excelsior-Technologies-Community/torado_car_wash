import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogsApi } from '../api';

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await blogsApi.getBlogById(slug);
      // Handle both direct response and wrapped response
      setBlog(response.data || response);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!blog) return <div className="text-center py-20">Blog not found</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/blogs/left-sidebar" className="text-orange-500 hover:text-orange-600 mb-6 inline-block">&larr; Back to Blogs</Link>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
            <span className="font-medium">by {blog.author_name || 'Admin'}</span>
            <span>•</span>
            <span>{formatDate(blog.created_at)}</span>
            {blog.category_name && (
              <>
                <span>•</span>
                <Link to={`/blogs/left-sidebar?category=${blog.category_slug}`} className="text-orange-500 hover:text-orange-600">
                  {blog.category_name}
                </Link>
              </>
            )}
          </div>

          {blog.featured_image && (
            <img src={`http://localhost:5000/uploads/${blog.featured_image}`} alt={blog.title} className="w-full h-96 object-cover rounded-lg mb-8" />
          )}

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">{blog.content}</p>
          </div>

          {blog.images && blog.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {blog.images.map((image, index) => (
                <img key={index} src={`http://localhost:5000/uploads/${image}`} alt={`${blog.title} ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
              ))}
            </div>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t">
              <span className="font-semibold">Tags:</span>
              {blog.tags.map(tag => (
                <Link key={tag.id} to={`/blogs/left-sidebar?tags=${tag.slug}`} className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-orange-500 hover:text-white transition">
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;
