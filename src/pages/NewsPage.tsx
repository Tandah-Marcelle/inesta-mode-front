import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { newsApi, NewsItem } from '../services/news.api';
import NewsCard from '../components/NewsCard';

function NewsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const activeNews = await newsApi.getActiveNews();
      setNewsItems(activeNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get all unique tags
  const allTags = [...new Set(newsItems.flatMap(item => item.tags || []))];
  
  // Filter news items by tag
  const filteredNews = activeTag 
    ? newsItems.filter(news => news.tags?.includes(activeTag)) 
    : newsItems;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
            News & Events
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Stay updated with the latest happenings, collection releases, and events at Inesta Mode
          </p>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container-custom">
          {/* Tags filter */}
          <div className="mb-10">
            <h2 className="text-lg font-medium mb-4">Filter by Tag</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTag === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                All
              </button>
              
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeTag === tag
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* News grid */}
          <div ref={ref}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-60 mb-4"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : inView && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredNews.map(news => (
                  <motion.div key={news.id} variants={item}>
                    <NewsCard news={news} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {!loading && filteredNews.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-secondary-500">
                  {activeTag ? 'No news found with this tag.' : 'No news available at this time.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default NewsPage;