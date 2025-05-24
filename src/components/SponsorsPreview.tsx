import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sponsors } from '../data/sponsors';

function SponsorsPreview() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={ref} className="py-20 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Humanitarian Partners</h2>
          <p className="section-subtitle">
            At Inesta Mode, we believe in giving back. We're proud to support these organizations making a positive impact in our world.
          </p>
        </div>

        {inView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {sponsors.map((sponsor) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-center max-w-xs"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-2">{sponsor.name}</h3>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link to="/sponsors" className="btn-primary">
                Learn More About Our Partners
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default SponsorsPreview;