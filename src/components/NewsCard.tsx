import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

// Import your local images with correct paths
import newsImage1 from '../assets/images/Events/Evenement Public vision award/1.jpg';
import newsImage2 from '../assets/images/Events/Talents et top model/2.jpg';
import newsImage3 from '../assets/images/Events/COMICA Miss cameroun grand centre/14.jpg';

interface NewsCardProps {
  news: NewsItem;
}

function NewsCard({ news }: NewsCardProps) {
  // Add console.log to verify images are loading
  console.log('Imported images:', {
    newsImage1,
    newsImage2,
    newsImage3
  });

  // Map your news items to local images
  const getNewsImage = () => {
    switch(news.id) {
      case '1': return newsImage1;
      case '2': return newsImage2;
      case '3': return newsImage3;
      default: return newsImage1;
    }
  };

  const imageSrc = getNewsImage();
  console.log(`Rendering news ${news.id} with image:`, imageSrc);

  return (
    <article className="card hover:shadow-lg h-full">
      <div className="relative overflow-hidden h-60">
        <img 
          src={imageSrc} 
          alt={news.title}
          className="w-full h-full object-cover image-hover"
          onError={(e) => {
            console.error('Error loading image:', e);
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