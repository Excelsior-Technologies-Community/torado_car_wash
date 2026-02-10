import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { blogsApi } from '../api';
import BlogCard from '../components/blog/BlogCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import Pagination from '../components/blog/Pagination';

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(searchParams.get('view') || 'left-sidebar');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    category: '',
    tags: [],
    search: ''
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam && ['grid', 'left-sidebar', 'right-sidebar'].includes(viewParam)) {
      setView(viewParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.tags.length && { tags: filters.tags.join(',') }),
        ...(filters.search && { search: filters.search })
      };
      const response = await blogsApi.getBlogs(params);
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogsApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await blogsApi.getTags();
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCategoryChange = (categorySlug) => {
    setFilters(prev => ({ ...prev, category: categorySlug, page: 1 }));
  };

  const handleTagToggle = (tagSlug) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tagSlug)
        ? prev.tags.filter(t => t !== tagSlug)
        : [...prev.tags, tagSlug],
      page: 1
    }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearAllFilters = () => {
    setFilters({
      page: 1,
      limit: 6,
      category: '',
      tags: [],
      search: ''
    });
  };

  const hasActiveFilters = filters.category || filters.tags.length > 0 || filters.search;

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex gap-3 mb-8 flex-wrap items-center">
        <button onClick={() => setView('grid')} className={`px-6 py-2 rounded border transition ${view === 'grid' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-300 hover:border-orange-500'}`}>Grid</button>
        <button onClick={() => setView('left-sidebar')} className={`px-6 py-2 rounded border transition ${view === 'left-sidebar' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-300 hover:border-orange-500'}`}>Left Sidebar</button>
        <button onClick={() => setView('right-sidebar')} className={`px-6 py-2 rounded border transition ${view === 'right-sidebar' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-gray-300 hover:border-orange-500'}`}>Right Sidebar</button>
        
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters} 
            className="ml-auto px-6 py-2 rounded border border-gray-300 bg-white hover:bg-orange-50 hover:border-orange-500 hover:text-orange-500 transition flex items-center gap-2"
          >
            <span>✕</span>
            Clear All Filters
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
          {filters.search && (
            <span className="px-3 py-1 bg-orange-100 text-orange-500 rounded-full text-sm flex items-center gap-2">
              Search: "{filters.search}"
              <button onClick={() => handleSearch('')} className="hover:text-orange-800">✕</button>
            </span>
          )}
          {filters.category && (
            <span className="px-3 py-1 bg-orange-100 text-orange-500 rounded-full text-sm flex items-center gap-2">
              {categories.find(c => c.slug === filters.category)?.name}
              <button onClick={() => handleCategoryChange('')} className="hover:text-orange-800">✕</button>
            </span>
          )}
          {filters.tags.map(tagSlug => (
            <span key={tagSlug} className="px-3 py-1 bg-orange-100 text-orange-500 rounded-full text-sm flex items-center gap-2">
              {tags.find(t => t.slug === tagSlug)?.name}
              <button onClick={() => handleTagToggle(tagSlug)} className="hover:text-orange-800">✕</button>
            </span>
          ))}
        </div>
      )}

      <div className={`flex flex-col lg:flex-row gap-8 ${view === 'right-sidebar' ? 'lg:flex-row-reverse' : ''}`}>
        {view !== 'grid' && (
          <BlogSidebar
            categories={categories}
            tags={tags}
            selectedCategory={filters.category}
            selectedTags={filters.tags}
            onCategoryChange={handleCategoryChange}
            onTagToggle={handleTagToggle}
            onSearch={handleSearch}
          />
        )}

        <div className="flex-1">
          <div className={`grid gap-8 mb-10 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {blogs.length === 0 && <div className="text-center py-20 text-gray-500">No blogs found</div>}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
