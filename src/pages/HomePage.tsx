import Hero from '../components/Hero';
import FeaturedCollection from '../components/FeaturedCollection';
import FeaturedProducts from '../components/FeaturedProducts';
import NewsPreview from '../components/NewsPreview';
import SponsorsPreview from '../components/SponsorsPreview';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

// Import your local workshop image

function HomePage() {
  return (
    <>
      <Hero />
      <div id="collections">
        <FeaturedCollection />
      </div>
      <div id="featured">
        <FeaturedProducts />
      </div>
      <div className="py-20 bg-white">
        <div className="container-custom">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={""} 
              alt="Atelier Inesta Mode" 
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 text-center">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
                  Conçu avec passion, porté avec fierté
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  Chaque robe chez Inesta Mode est minutieusement confectionnée à la main par des artisans qualifiés, garantissant qualité, originalité et souci du moindre détail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Testimonials />
      <FAQ />
      <div id="news">
        <NewsPreview />
      </div>
      <div id="sponsors">
        <SponsorsPreview />
      </div>
    </>
  );
}

export default HomePage;