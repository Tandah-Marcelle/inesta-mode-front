import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { ExternalLink, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { partnersApi, Partner } from '../services/partners.api';

function SponsorsPage() {
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
      const activePartners = await partnersApi.getActivePartners();
      setPartners(activePartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <section className="pt-24 pb-12 bg-secondary-950 text-white">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">
            Our Humanitarian Partners
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            At Inesta Mode, we believe in giving back to society. Learn about the organizations we partner with to make a positive impact in our world.
          </p>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Making a Difference Together</h2>
            <p className="section-subtitle">
              We're proud to support these incredible organizations that are making our world a better place. A portion of every purchase you make goes towards supporting these causes.
            </p>
          </div>
          
          <div ref={ref}>
            {loading ? (
              <div className="space-y-12">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <div className="bg-gray-200 h-64 md:h-full w-full"></div>
                      </div>
                      <div className="p-8 md:w-2/3">
                        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="space-y-2 mb-6">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : inView && partners.length > 0 && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-12"
              >
                {partners.map((partner) => (
                  <motion.div 
                    key={partner.id}
                    variants={item} 
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        {partner.logoUrl ? (
                          <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="w-full h-64 md:h-full object-contain bg-gray-50 p-4"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-64 md:h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <span className="text-primary-600 text-6xl font-display">
                              🤝
                            </span>
                          </div>
                        )}
                        {partner.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                              Featured Partner
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-8 md:w-2/3">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-display text-2xl font-medium">
                            {partner.name}
                          </h3>
                          <span className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full">
                            {partner.partnershipType.charAt(0).toUpperCase() + partner.partnershipType.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-secondary-700 mb-6">
                          {partner.description}
                        </p>
                        
                        {/* Contact Information */}
                        <div className="space-y-2 mb-6 text-sm text-secondary-600">
                          {partner.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={16} />
                              <span>{partner.location}</span>
                            </div>
                          )}
                          {partner.contactEmail && (
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              <a href={`mailto:${partner.contactEmail}`} className="text-primary-600 hover:text-primary-700">
                                {partner.contactEmail}
                              </a>
                            </div>
                          )}
                          {partner.contactPhone && (
                            <div className="flex items-center gap-2">
                              <Phone size={16} />
                              <a href={`tel:${partner.contactPhone}`} className="text-primary-600 hover:text-primary-700">
                                {partner.contactPhone}
                              </a>
                            </div>
                          )}
                          {partner.partnershipStartDate && (
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>
                                Partner since {new Date(partner.partnershipStartDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Achievements */}
                        {partner.achievements && (
                          <div className="mb-6">
                            <h4 className="font-medium text-secondary-800 mb-2">Key Achievements:</h4>
                            <p className="text-secondary-600 text-sm">{partner.achievements}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-4">
                          {partner.website && (
                            <a 
                              href={partner.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-primary inline-flex items-center"
                            >
                              Visit Website
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          )}
                          {partner.contactEmail && (
                            <a 
                              href={`mailto:${partner.contactEmail}`}
                              className="btn-secondary inline-flex items-center"
                            >
                              Contact Partner
                              <Mail className="ml-2 h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {!loading && partners.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-secondary-500">No partners available at this time.</p>
              </div>
            )}
          </div>
          
          <div className="mt-20 bg-primary-50 rounded-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl md:text-3xl font-medium mb-4">
                Want to Become a Partner?
              </h3>
              <p className="text-lg text-secondary-700 max-w-3xl mx-auto">
                If your organization is focused on making a positive impact in the world, we'd love to hear from you. Together, we can create meaningful change.
              </p>
            </div>
            <div className="text-center">
              <a href="/contact" className="btn-primary">
                Contact Us About Partnerships
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SponsorsPage;