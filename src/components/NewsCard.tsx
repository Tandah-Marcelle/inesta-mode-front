import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="card hover:shadow-lg h-full">
      <div className="relative overflow-hidden h-60">
        <img 
          src={news.image} 
          alt={news.title}
          className="w-full h-full object-cover image-hover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute top-4 left-4 bg-white text-secondary-800 text-sm px-3 py-1 rounded-full">
          {news.date}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-display font-medium mb-3">{news.title}</h3>
        <p className="text-secondary-600 mb-4 line-clamp-3">
          {news.content}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {news.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <Link to={`/news/${news.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
          Read more
        </Link>
      </div>
    </article>
  );
}

export default NewsCard;
