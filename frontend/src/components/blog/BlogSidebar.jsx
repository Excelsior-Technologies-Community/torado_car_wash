import { useState } from 'react';

const BlogSidebar = ({ 
  categories, 
  tags, 
  selectedCategory, 
  selectedTags, 
  onCategoryChange, 
  onTagToggle, 
  onSearch 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="w-full top-0 sticky self-start lg:w-80 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Search</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-24 border border-gray-300 rounded focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <div className="absolute right-1 top-1 flex gap-1">
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-2 text-gray-500 hover:text-orange-500 transition"
              >
                ✕
              </button>
            )}
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li
              key={category.id}
              className={`flex justify-between items-center p-3 rounded cursor-pointer transition ${
                selectedCategory === category.slug 
                  ? 'bg-orange-500 text-white' 
                  : 'hover:bg-gray-100 border border-transparent hover:border-gray-200'
              }`}
              onClick={() => onCategoryChange(selectedCategory === category.slug ? '' : category.slug)}
            >
              <span className="font-medium">{category.name}</span>
              <span className={`text-sm px-2 py-1 rounded ${
                selectedCategory === category.slug ? 'bg-orange-600' : 'bg-gray-200 text-gray-600'
              }`}>
                ({category.count || 0})
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              className={`px-4 py-2 rounded-full border transition font-medium ${
                selectedTags.includes(tag.slug) 
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                  : 'bg-white border-gray-300 hover:border-orange-500 hover:text-orange-500'
              }`}
              onClick={() => onTagToggle(tag.slug)}
            >
              {tag.name}
              {selectedTags.includes(tag.slug) && <span className="ml-1">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
