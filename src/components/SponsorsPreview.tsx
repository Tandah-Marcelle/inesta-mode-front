import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { partnersApi, Partner } from '../services/partners.api';

function SponsorsPreview() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const featuredPartners = await partnersApi.getFeaturedPartners();
      const activePartners = await partnersApi.getActivePartners();
      // Prioritize featured, then get active ones
      const displayPartners = featuredPartners.length > 0 
        ? featuredPartners.slice(0, 3)
        : activePartners.slice(0, 3);
      setPartners(displayPartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} className="py-20 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Our Humanitarian Partners</h2>
          <p className="section-subtitle">
            At Inesta Mode, we believe in giving back. We're proud to support these organizations making a positive impact in our world.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse text-center max-w-xs">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <div className="h-12 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        ) : inView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            {partners.length > 0 ? (
              <>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                  {partners.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 * (index + 1) }}
                      className="text-center max-w-xs"
                    >
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="w-32 h-32 mx-auto mb-4 rounded-full object-cover border-4 border-primary-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center border-4 border-primary-100">
                          <span className="text-primary-600 text-3xl font-display">🤝</span>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                      {partner.isFeatured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Featured Partner
                        </span>
                      )}
                      <p className="text-sm text-secondary-600 mt-2">
                        {partner.partnershipType.charAt(0).toUpperCase() + partner.partnershipType.slice(1)}
                      </p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link to="/sponsors" className="btn-primary">
                    Learn More About Our Partners
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-secondary-500 mb-6">We're always looking for new humanitarian partners to support meaningful causes.</p>
                <Link to="/contact" className="btn-primary">
                  Become a Partner
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default SponsorsPreview;