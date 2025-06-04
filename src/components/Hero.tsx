import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import image1 from "../assets/images/collection marrige robe blanche/fille dhonneur/3.jpg";
import image2 from "../assets/images/collection marrige robe blanche/fille dhonneur/2.jpg";
import image3 from "../assets/images/Collection homme/garcon dhonneur/3.jpg";

// Preload images for better performance
const preloadImages = (urls) => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

const heroBackgrounds = [
  // {
  //   id: 1,
  //   image: image1,
  //   alt: "Bridal dress collection - elegant white gown"
  // },
  {
    id: 2,
    image: image2,
    alt: "Bridesmaid dress collection - stylish designs"
  },
  {
    id: 3,
    image: image3,
    alt: "Wedding party fashion - sophisticated attire"
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload images on component mount
    preloadImages(heroBackgrounds.map(bg => bg.image));
    setIsLoading(false);
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === heroBackgrounds.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
      </section>
    );
  }

  return (
    <section className="relative h-screen" aria-label="Hero slider">
      {/* Background images with fade transition */}
      {heroBackgrounds.map((bg, index) => (
        <div
          key={bg.id}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bg.image})`,
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 1 : 0
          }}
          aria-hidden={index !== currentSlide}
          role="img"
          aria-label={bg.alt}
        />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* Content */}
      <div className="relative h-full flex items-center z-20 px-4">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold mb-4 leading-tight">
            Mode artisanale exquise.








            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-lg">
            Découvrez l'art d'Inesta Mode — où chaque robe est un chef-d'œuvre, confectionné avec passion et précision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/collections" 
                className="btn-primary px-8 py-3 text-lg"
                aria-label="Explore our collections"
              >
                Explorez Our Collections
              </Link>
              <Link 
                to="/about" 
                className="btn-outline border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                aria-label="Learn about our story"
              >
                Notre Histoire
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroBackgrounds.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;