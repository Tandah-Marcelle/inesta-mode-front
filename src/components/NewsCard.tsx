import { Link } from 'react-router-dom';
import { NewsItem } from '../services/news.api';
import { Calendar, MapPin } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
}

function NewsCard({ news }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isEvent = news.category === 'event';

  return (
    <article className="card hover:shadow-lg h-full">
      <div className="relative overflow-hidden h-60">
        {news.imageUrl ? (
          <img 
            src={news.imageUrl} 
            alt={news.title}
            className="w-full h-full object-cover image-hover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
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
        
        <p className="text-secondary-600 mb-4 line-clamp-3">
          {news.excerpt || news.content}
        </p>
        
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {news.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <Link to={`/news/${news.slug || news.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
          Read more
        </Link>
      </div>
    </article>
  );
}

export default NewsCard;
