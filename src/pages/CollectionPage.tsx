import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useCategories } from '../contexts/CategoriesContext';
import { productsApi, Product } from '../services/products.api';
import ProductCard from '../components/ProductCard';

function CollectionPage() {
  const { categoryId } = useParams();
  const { categories, loading: categoriesLoading, getCategoryById, getCategoryBySlug } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    setActiveCategory(categoryId || 'all');
    setCurrentPage(1);
  }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sortBy, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Get category ID from slug if needed
      let categoryIdToUse = null;
      if (activeCategory !== 'all') {
        const category = getCategoryBySlug(activeCategory) || getCategoryById(activeCategory);
        categoryIdToUse = category?.id;
      }
      
      const params = {
        page: currentPage,
        limit: productsPerPage,
        status: 'published' as const,
        ...(categoryIdToUse && { categoryId: categoryIdToUse }),
        ...(sortBy === 'price-low' && { sortBy: 'price' as const, sortOrder: 'ASC' as const }),
        ...(sortBy === 'price-high' && { sortBy: 'price' as const, sortOrder: 'DESC' as const }),
        ...(sortBy === 'popular' && { sortBy: 'viewCount' as const, sortOrder: 'DESC' as const }),
        ...(sortBy === 'newest' && { sortBy: 'createdAt' as const, sortOrder: 'DESC' as const }),
      };
      
      const response = await productsApi.getProducts(params);
      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get current category details - try by slug first, then by id
  const currentCategory = activeCategory !== 'all' 
    ? getCategoryBySlug(activeCategory) || getCategoryById(activeCategory)
    : null;
  
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
                  {categoriesLoading ? (
                    [...Array(5)].map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse h-8 bg-gray-200 rounded mb-1"></div>
                      </li>
                    ))
                  ) : (
                    categories.map(category => (
                      <li key={category.id}>
                        <button 
                          onClick={() => setActiveCategory(category.slug || category.id)}
                          className={`w-full text-left px-2 py-1 rounded ${activeCategory === (category.slug || category.id) ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-50'}`}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))
                  )}
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
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(productsPerPage)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div ref={ref}>
                  {inView && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                      {products.map(product => (
                        <ProductCard key={product.id} dress={product} />
                      ))}
                    </motion.div>
                  )}
                  
                  {/* Pagination */}
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.max(totalPages, 1) }, (_, index) => (
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
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-secondary-500">No products found in this category.</p>
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