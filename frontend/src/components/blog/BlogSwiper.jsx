import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { blogsApi } from '../../api';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BlogSwiper = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogsApi.getBlogs({ limit: 8 });
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          // navigation
          // pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }}
        >
          {blogs && blogs.length > 0 && blogs.map(blog => {
            const imageUrl = blog.featured_image 
              ? `http://localhost:5000/uploads/${blog.featured_image}` 
              : '/images/default-blog.jpg';

            return (
              <SwiperSlide key={blog.id}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
                  <div className="h-64 overflow-hidden flex-shrink-0">
                    <img 
                      src={imageUrl} 
                      alt={blog.title} 
                      className="w-full h-full object-cover hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span>{formatDate(blog.created_at)}</span>
                      <span>•</span>
                      <span>No Comments</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4 hover:text-red-500 transition line-clamp-2 flex-grow">
                      {blog.title}
                    </h3>
                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="text-red-500 font-medium hover:text-red-600 transition"
                    >
                      Read Blog
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogSwiper;
