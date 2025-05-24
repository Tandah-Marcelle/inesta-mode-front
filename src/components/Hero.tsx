import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const heroBackgrounds = [
  'https://images.pexels.com/photos/949670/pexels-photo-949670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2122363/pexels-photo-2122363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroBackgrounds.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen">
      {/* Background images with fade transition */}
      {heroBackgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bg})`,
            opacity: index === currentSlide ? 1 : 0,
            zIndex: index === currentSlide ? 1 : 0
          }}
        />
      ))}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* Content */}
      <div className="relative h-full flex items-center z-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <h1 className="font-display text-4xl md:text-6xl font-semibold mb-4">
              Exquisite Handcrafted Fashion
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Discover the artistry of Inesta Mode—where each dress is a masterpiece, handcrafted with passion and precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/collections" className="btn-primary">
                Explore Collections
              </Link>
              <Link to="/about" className="btn-outline border-white text-white hover:bg-white/10">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroBackgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;