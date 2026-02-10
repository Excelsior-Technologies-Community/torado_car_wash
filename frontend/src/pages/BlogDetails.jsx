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
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!blog) return <div className="text-center py-20">Blog not found</div>;

  const mainImage = blog.featured_image 
    ? `http://localhost:5000/uploads/${blog.featured_image}` 
    : '/images/default-blog.jpg';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link to="/blogs" className="text-red-500 hover:text-red-600">&larr; Back to Blogs</Link>
      </div>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <span className="font-medium">by {blog.author_name || 'Admin'}</span>
            </div>
            <span>•</span>
            <span>{formatDate(blog.created_at)}</span>
            <span>•</span>
            <span className="text-red-500">{blog.category_name}</span>
            <Link to="#" className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Car Wash
            </Link>
          </div>

          <div className="mb-8">
            <img src={mainImage} alt={blog.title} className="w-full h-96 object-cover rounded-lg" />
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">{blog.title}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{blog.content}</p>
            
            {blog.images && blog.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 my-8">
                {blog.images.map((image, index) => (
                  <img 
                    key={index}
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={`${blog.title} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <p className="text-gray-700 italic">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce enim a erat sit vulputate elementum non. Risus nec viverra ornare venenatis porttitor cursus tristique sit. Vitae egestas tellus amet mi hac cursus in hac."
            </p>
            <p className="text-red-500 font-semibold mt-2">- Thomas Bellum</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Get Some General Car Maintenance Tips</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Inspect your vehicle regularly',
                'Clean your engine air filter',
                'Protect your headlights',
                'Change your oil regularly',
                'Check your tire pressure regularly',
                'Charge your car air plug',
                'Ensure your cooling system',
                'Check your battery',
                'Protect your car interiors'
              ].map((tip, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t">
              <span className="font-semibold">Tags:</span>
              {blog.tags.map(tag => (
                <Link 
                  key={tag.id}
                  to={`/blogs?tags=${tag.slug}`}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-red-500 hover:text-white transition"
                >
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
