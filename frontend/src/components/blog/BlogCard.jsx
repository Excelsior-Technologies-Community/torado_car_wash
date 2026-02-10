import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const imageUrl = blog.featuorange_image 
    ? `http://localhost:5000/uploads/${blog.featuorange_image}` 
    : '/images/default-blog.jpg';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
      <div className="h-56 overflow-hidden">
        <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover hover:scale-110 transition duration-300" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <span className="text-orange-500 font-medium">{blog.category_name || 'Car Repair'}</span>
          <span>|</span>
          <span>{formatDate(blog.created_at)}</span>
          {blog.tags && blog.tags.length > 0 && (
            <>
              <span>|</span>
              <span>No Comments</span>
            </>
          )}
        </div>
        <h3 className="text-xl font-bold mb-3 hover:text-orange-500 transition">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content?.substring(0, 150)}...
        </p>
        <Link to={`/blog/${blog.slug}`} className="inline-block text-orange-500 font-medium hover:text-orange-600 transition">
          Read Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
