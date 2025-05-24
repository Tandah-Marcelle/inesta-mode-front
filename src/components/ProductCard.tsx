import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Dress } from '../types';
import { useShop } from '../contexts/ShopContext';

interface ProductCardProps {
  dress: Dress;
}

function ProductCard({ dress }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleLike, addToCart } = useShop();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleLike(dress.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(dress);
  };

  return (
    <Link 
      to={`/product/${dress.id}`}
      className="block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card h-full hover:shadow-lg transition-all duration-300">
        <div className="relative overflow-hidden">
          <img 
            src={isHovered && dress.images.length > 1 ? dress.images[1] : dress.images[0]} 
            alt={dress.name}
            className="w-full h-80 object-cover transition-transform duration-700 ease-in-out hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button 
              onClick={handleLikeClick}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors duration-300"
            >
              <Heart className={`h-5 w-5 ${dress.liked ? 'fill-accent-500 text-accent-500' : 'text-secondary-400'}`} />
            </button>
            <button 
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors duration-300"
            >
              <ShoppingBag className="h-5 w-5 text-secondary-400" />
            </button>
          </div>
          
          {dress.new && (
            <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs px-3 py-1 rounded-full">
              New
            </div>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-display font-medium mb-2">{dress.name}</h3>
          <p className="text-sm text-secondary-600 mb-3">{dress.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">${dress.price.toFixed(2)}</p>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-accent-500" />
              <span className="text-sm text-secondary-600">{dress.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;