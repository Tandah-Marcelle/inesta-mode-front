import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

function AboutPage() {
  const { ref: storyRef, inView: storyInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const { ref: valuesRef, inView: valuesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const { ref: processRef, inView: processInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <>
      <section className="pt-24 pb-12 bg-secondary-950 text-white">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">
            Our Story
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Learn about Inesta Mode, our journey, values, and the passion behind every stitch
          </p>
        </div>
      </section>
      
      <section ref={storyRef} className="py-16">
        <div className="container-custom">
          {storyInView && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="font-display text-3xl font-medium mb-6">The Inesta Mode Journey</h2>
                <p className="text-secondary-700 mb-4">
                  Inesta Mode began as a small passion project in 2018, born from a love for creating unique, handcrafted dresses that tell a story. What started in a modest home studio has grown into a brand recognized for its distinctive designs and commitment to quality.
                </p>
                <p className="text-secondary-700 mb-4">
                  Our founder, Isabella Martins, brings over 15 years of experience in haute couture and a vision to make luxury fashion more accessible while maintaining the highest standards of craftsmanship.
                </p>
                <p className="text-secondary-700">
                  Every Inesta Mode creation embodies our philosophy: that fashion should be both beautiful and meaningful, celebrating the individuality of each person who wears our designs.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                      src={""}
                  alt="Inesta Mode Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>
      
      <section ref={valuesRef} className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide our work and define our brand
            </p>
          </div>
          
          {valuesInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="font-display text-xl font-medium mb-4">Craftsmanship</h3>
                <p className="text-secondary-700">
                  We believe in the value of handcrafted quality. Each dress is meticulously made with attention to every detail, ensuring exceptional quality and uniqueness.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="font-display text-xl font-medium mb-4">Sustainability</h3>
                <p className="text-secondary-700">
                  We're committed to responsible fashion. We source ethical materials, minimize waste, and create timeless pieces designed to last.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="font-display text-xl font-medium mb-4">Community</h3>
                <p className="text-secondary-700">
                  We believe in giving back. Through our humanitarian partnerships, we support causes that create positive change in communities worldwide.
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
      
      <section ref={processRef} className="py-16">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Process</h2>
            <p className="section-subtitle">
              From concept to creation, each Inesta Mode piece follows a journey of artistic development
            </p>
          </div>
          
          {processInView && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                {/* Process timeline */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
                
                {/* Process steps */}
                <div className="space-y-12 md:space-y-0">
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative md:ml-auto md:w-1/2 md:pl-16 md:pr-0 px-6"
                  >
                    <div className="hidden md:block absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 border-4 border-white"></div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-display text-xl font-medium mb-3">Design & Inspiration</h3>
                      <p className="text-secondary-700">
                        Every piece begins as a concept inspired by art, culture, nature, or a specific muse. Our designers sketch ideas, experiment with fabrics, and refine the vision.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative md:mr-auto md:w-1/2 md:pr-16 md:ml-0 px-6 md:mt-24"
                  >
                    <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 border-4 border-white"></div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-display text-xl font-medium mb-3">Material Selection</h3>
                      <p className="text-secondary-700">
                        We source high-quality, ethically produced fabrics and materials. Each is carefully chosen for its texture, color, and how it complements the design.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative md:ml-auto md:w-1/2 md:pl-16 md:pr-0 px-6 md:mt-24"
                  >
                    <div className="hidden md:block absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 border-4 border-white"></div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-display text-xl font-medium mb-3">Crafting & Stitching</h3>
                      <p className="text-secondary-700">
                        Each garment is meticulously constructed by skilled artisans. We employ both traditional techniques and modern methods to achieve the perfect finish.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="relative md:mr-auto md:w-1/2 md:pr-16 md:ml-0 px-6 md:mt-24"
                  >
                    <div className="hidden md:block absolute right-0 top-0 transform translate-x-1/2 w-8 h-8 rounded-full bg-primary-500 border-4 border-white"></div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-display text-xl font-medium mb-3">Quality Inspection</h3>
                      <p className="text-secondary-700">
                        Every piece undergoes rigorous quality checks to ensure it meets our high standards. Only when we're completely satisfied does a creation become part of the Inesta Mode collection.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

export default AboutPage;