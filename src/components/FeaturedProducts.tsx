import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { productsApi, Product } from '../services/products.api';
import { useShop } from '../contexts/ShopContext';

function FeaturedProducts() {
  const { toggleLike } = useShop();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const products = await productsApi.getFeaturedProducts(6);
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Créations en vedette</h2>
          <p className="section-subtitle">
          Découvrez nos modèles les plus prisés, confectionnés avec passion et précision.
          </p>
        </div>

        {inView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse px-3 pb-6">
                    <div className="bg-gray-200 h-80 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Slider {...settings}>
                {featuredProducts.map((product) => (
                  <div key={product.id} className="px-3 pb-6">
                    <div className="card h-full hover:shadow-lg transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img 
                          src={product.images?.[0]?.url || '/placeholder-image.jpg'} 
                          alt={product.name}
                          className="w-full h-80 object-cover image-hover"
                        />
                        <div className="absolute top-3 right-3">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleLike(product.id);
                            }}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors duration-300"
                          >
                            <Heart className={`h-5 w-5 text-secondary-400`} />
                          </button>
                        </div>
                        
                        {product.isNew && (
                          <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs px-3 py-1 rounded-full">
                            New
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-xl font-display font-medium mb-2">{product.name}</h3>
                        <p className="text-sm text-secondary-600 mb-3">{product.category?.name || ''}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-semibold">${Number(product.price).toFixed(2)}</p>
                          <Link 
                            to={`/product/${product.id}`} 
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Voir les détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;