import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { newsApi, NewsItem } from '../services/news.api';

function NewsPreview() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const activeNews = await newsApi.getActiveNews();
      // Get featured first, then others
      const sortedNews = [...activeNews].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setNewsItems(sortedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
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
    <section ref={ref} className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Latest News & Events</h2>
          <p className="section-subtitle">
            Stay updated with the latest happenings at Inesta Mode
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse card">
                <div className="bg-gray-200 h-60 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : inView && newsItems.length > 0 && (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {newsItems.slice(0, 2).map((news) => {
              const isEvent = news.category === 'event';
              const formatDate = (dateString: string) => {
                return new Date(dateString).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              };
              
              return (
                <motion.article key={news.id} variants={item} className="card hover:shadow-lg">
                  <div className="relative overflow-hidden h-60">
                    {news.imageUrl ? (
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="w-full h-full object-cover image-hover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <span className="text-primary-600 text-4xl font-display">
                          {isEvent ? '📅' : '📰'}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        isEvent 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isEvent ? 'Event' : 'News'}
                      </span>
                      {news.isFeatured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-secondary-800 text-sm px-3 py-1 rounded-full">
                      {isEvent && news.eventDate 
                        ? formatDate(news.eventDate)
                        : formatDate(news.createdAt)
                      }
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display font-medium mb-3">{news.title}</h3>
                    
                    {isEvent && (news.eventDate || news.eventLocation) && (
                      <div className="flex flex-col gap-1 mb-3 text-sm text-secondary-600">
                        {news.eventDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatDate(news.eventDate)}</span>
                          </div>
                        )}
                        {news.eventLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{news.eventLocation}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <p className="text-secondary-600 mb-4 line-clamp-2">
                      {news.excerpt || news.content}
                    </p>
                    
                    {news.tags && news.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {news.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link to="/news" className="text-primary-600 hover:text-primary-700 font-medium">
                      Read more
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
        
        {!loading && newsItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary-500">No news or events available at this time.</p>
          </div>
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