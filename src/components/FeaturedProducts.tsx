import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';

function FeaturedProducts() {
  const { dresses, toggleLike } = useShop();
  const [featuredDresses, setFeaturedDresses] = useState([]);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    // Filter featured dresses
    const featured = dresses.filter(dress => dress.featured);
    setFeaturedDresses(featured);
  }, [dresses]);

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
            <Slider {...settings}>
              {featuredDresses.map((dress) => (
                <div key={dress.id} className="px-3 pb-6">
                  <div className="card h-full hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={dress.images[0]} 
                        alt={dress.name}
                        className="w-full h-80 object-cover image-hover"
                      />
                      <div className="absolute top-3 right-3">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleLike(dress.id);
                          }}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors duration-300"
                        >
                          <Heart className={`h-5 w-5 ${dress.liked ? 'fill-accent-500 text-accent-500' : 'text-secondary-400'}`} />
                        </button>
                      </div>
                      
                      {dress.new && (
                        <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs px-3 py-1 rounded-full">
                          New
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-xl font-display font-medium mb-2">{dress.name}</h3>
                      <p className="text-sm text-secondary-600 mb-3">{dress.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">${dress.price.toFixed(2)}</p>
                        <Link 
                          to={`/product/${dress.id}`} 
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
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;