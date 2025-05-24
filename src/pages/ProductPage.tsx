import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';
import ProductImageGallery from '../components/ProductImageGallery';
import CommentSection from '../components/CommentSection';

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { dresses, addToCart, toggleLike } = useShop();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = dresses.find(dress => dress.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      // Set default selections
      setSelectedSize(foundProduct.sizes[0]);
      setSelectedColor(foundProduct.colors[0]);
    }
  }, [productId, dresses]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity
      });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="pt-28 pb-12 min-h-screen flex items-center justify-center">
        <p className="text-xl text-secondary-500">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-12">
      <div className="container-custom">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductImageGallery images={product.images} name={product.name} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-medium mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-secondary-600 mb-4">
              {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            
            <div className="flex items-center space-x-2 mb-6">
              <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
              <div className="flex items-center text-secondary-600">
                <Heart className={`h-5 w-5 mr-1 ${product.liked ? 'fill-accent-500 text-accent-500' : ''}`} />
                <span>{product.likes} likes</span>
              </div>
            </div>
            
            <p className="text-secondary-700 mb-6">
              {product.description}
            </p>
            
            <div className="border-t border-b py-6 mb-6">
              <h3 className="font-medium mb-4">Details:</h3>
              <ul className="list-disc list-inside space-y-2 text-secondary-700">
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Size:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-secondary-300 hover:border-secondary-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Color:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-secondary-300 hover:border-secondary-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3">Quantity:</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 border border-secondary-300 rounded-md flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 border border-secondary-300 rounded-md flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex items-center justify-center gap-2 flex-1"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={() => toggleLike(product.id)}
                className={`btn-outline flex items-center justify-center gap-2 flex-1 ${
                  product.liked ? 'bg-primary-50' : ''
                }`}
              >
                <Heart className={`h-5 w-5 ${product.liked ? 'fill-primary-500 text-primary-500' : ''}`} />
                {product.liked ? 'Liked' : 'Like'}
              </button>
            </div>
          </motion.div>
        </div>
        
        <CommentSection productId={product.id} />
      </div>
    </div>
  );
}

export default ProductPage;