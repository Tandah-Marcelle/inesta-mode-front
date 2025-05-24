import Hero from '../components/Hero';
import FeaturedCollection from '../components/FeaturedCollection';
import FeaturedProducts from '../components/FeaturedProducts';
import NewsPreview from '../components/NewsPreview';
import SponsorsPreview from '../components/SponsorsPreview';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';

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
              src="https://images.pexels.com/photos/5709656/pexels-photo-5709656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Inesta Mode Workshop" 
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 text-center">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
                  Crafted With Passion, Worn With Pride
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  Each dress at Inesta Mode is meticulously handcrafted by skilled artisans, ensuring quality, uniqueness, and attention to every detail.
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