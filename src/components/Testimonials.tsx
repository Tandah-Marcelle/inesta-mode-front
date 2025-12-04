import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { testimonialsApi, Testimonial } from '../services/testimonials.api';

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialsApi.getActiveTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle">
            Quelques-unes des personnalites qui apprecies et encouragent notre travail.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-200 h-64"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="border-t pt-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials.map((testimonial, index) => (
              inView && (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <blockquote className="text-secondary-700 italic mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="border-t pt-4">
                      <h4 className="font-display text-lg font-medium">{testimonial.name}</h4>
                      <p className="text-primary-600">{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              )
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;