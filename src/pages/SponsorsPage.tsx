import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { sponsors } from '../data/sponsors';

function SponsorsPage() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
            {inView && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-12"
              >
                {sponsors.map((sponsor) => (
                  <motion.div 
                    key={sponsor.id}
                    variants={item} 
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-8 md:w-2/3">
                        <h3 className="font-display text-2xl font-medium mb-4">
                          {sponsor.name}
                        </h3>
                        <p className="text-secondary-700 mb-6">
                          {sponsor.description}
                        </p>
                        <a 
                          href={sponsor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center"
                        >
                          Visit Website
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
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