import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';

function CollectionPage() {
  const { categoryId } = useParams();
  const { dresses } = useShop();
  const [filteredDresses, setFilteredDresses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const dressesPerPage = 8;
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    setActiveCategory(categoryId || 'all');
    setCurrentPage(1);
  }, [categoryId]);

  useEffect(() => {
    let filtered = [...dresses];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(dress => dress.category === activeCategory);
    }
    
    // Sort
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'newest':
      default:
        // Assuming newer items have "new" flag set
        filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
    }
    
    setFilteredDresses(filtered);
  }, [activeCategory, dresses, sortBy]);

  // Pagination
  const indexOfLastDress = currentPage * dressesPerPage;
  const indexOfFirstDress = indexOfLastDress - dressesPerPage;
  const currentDresses = filteredDresses.slice(indexOfFirstDress, indexOfLastDress);
  const totalPages = Math.ceil(filteredDresses.length / dressesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get current category details
  const currentCategory = categories.find(cat => cat.id === activeCategory);
  
  return (
    <>
      {/* Hero section for the collection */}
      <section className="pt-24 pb-12 bg-secondary-950 text-white">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">
            {currentCategory ? currentCategory.name : 'All Collections'}
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            {currentCategory ? currentCategory.description : 'Explore our complete range of handcrafted dresses designed with passion and precision.'}
          </p>
        </div>
      </section>
      
      {/* Filters and products */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar - mobile toggle */}
            <div className="md:hidden mb-4">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-secondary-200 rounded-lg"
              >
                <Filter size={18} />
                <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            </div>
            
            {/* Filters sidebar */}
            <div className={`md:block md:w-64 ${isFilterOpen ? 'block' : 'hidden'}`}>
              <div className="sticky top-24 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-display text-xl mb-4">Categories</h3>
                <ul className="space-y-2 mb-6">
                  <li>
                    <button 
                      onClick={() => setActiveCategory('all')}
                      className={`w-full text-left px-2 py-1 rounded ${activeCategory === 'all' ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-50'}`}
                    >
                      All Collections
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category.id}>
                      <button 
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-2 py-1 rounded ${activeCategory === category.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-50'}`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
                
                <h3 className="font-display text-xl mb-4">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            {/* Products grid */}
            <div className="flex-1">
              {currentDresses.length > 0 ? (
                <div ref={ref}>
                  {inView && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {currentDresses.map(dress => (
                        <ProductCard key={dress.id} dress={dress} />
                      ))}
                    </motion.div>
                  )}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`w-10 h-10 rounded-lg ${
                              currentPage === index + 1
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-secondary-200 text-secondary-700 hover:bg-secondary-50'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-secondary-500">No dresses found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CollectionPage;