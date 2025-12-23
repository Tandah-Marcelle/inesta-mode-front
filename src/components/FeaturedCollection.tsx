import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useCategories } from '../contexts/CategoriesContext';

function FeaturedCollection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { categories, loading, error } = useCategories();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Inesta Mode  Collections</h2>
          <p className="section-subtitle">
          Explorez notre gamme variée de robes artisanales, chacune racontant une histoire unique d'élégance et de style.
          </p>
        </div>

        {error && (
          <div className="text-center py-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
              <p className="text-orange-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div 
            className="grid gap-8"
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              maxWidth: '100%'
            }}
          >
            {[...Array(9)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : inView && categories.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-8"
            style={{
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              maxWidth: '100%'
            }}
          >
            {categories.slice(0, 9).map((category, index) => (
              <motion.div key={category.id} variants={item}>
                <Link 
                  to={`/collections/${category.slug || category.id}`}
                  className="block relative overflow-hidden rounded-lg shadow-md group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    className="aspect-[3/4] bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110 bg-gray-200"
                    style={{ 
                      backgroundImage: category.image ? `url(${category.image})` : undefined
                    }}
                  >
                    {!category.image && (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-lg font-display">{category.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full">
                      <h3 className="text-2xl font-display text-white mb-2">{category.name}</h3>
                      <p className={`text-white/80 text-sm transition-all duration-300 ${hoveredIndex === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {category.description}
                      </p>
                      <div className={`mt-4 overflow-hidden transition-all duration-300 ${hoveredIndex === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                        Voir Toutes les Collections                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-secondary-500">Aucune collection disponible pour le moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/collections" className="btn-primary">
          Voir Toutes les Collections
                    </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection;