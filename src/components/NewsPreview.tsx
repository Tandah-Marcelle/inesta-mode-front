import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { newsItems } from '../data/news';

function NewsPreview() {
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
    <section ref={ref} className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Latest News & Events</h2>
          <p className="section-subtitle">
            Stay updated with the latest happenings at Inesta Mode
          </p>
        </div>

        {inView && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {newsItems.slice(0, 2).map((news) => (
              <motion.article key={news.id} variants={item} className="card hover:shadow-lg">
                <div className="relative overflow-hidden h-60">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover image-hover"
                  />
                  <div className="absolute top-4 left-4 bg-white text-secondary-800 text-sm px-3 py-1 rounded-full">
                    {news.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-medium mb-3">{news.title}</h3>
                  <p className="text-secondary-600 mb-4 line-clamp-2">
                    {news.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {news.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link to="/news" className="text-primary-600 hover:text-primary-700 font-medium">
                    Read more
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link to="/news" className="btn-primary">
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewsPreview;