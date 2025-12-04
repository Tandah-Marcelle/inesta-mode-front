import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { productsApi, Product } from '../services/products.api';
import ProductImageGallery from '../components/ProductImageGallery';
import CommentSection from '../components/CommentSection';

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const productData = await productsApi.getProductById(id);
      setProduct(productData);
      
      // Set default selections
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
      
      // Increment view count
      await productsApi.incrementViewCount(id);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Add to cart logic - you can implement this later
      console.log('Add to cart:', {
        product,
        selectedSize,
        selectedColor,
        quantity
      });
    }
  };

  const handleToggleLike = () => {
    if (product) {
      // Toggle like logic - you can implement this later
      console.log('Toggle like for product:', product.id);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading || !product) {
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
            <ProductImageGallery 
              images={product.images?.map(img => img.url) || []} 
              name={product.name} 
            />
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
              {product.category?.name || ''}
            </p>
            
            <div className="flex items-center space-x-2 mb-6">
              <p className="text-2xl font-semibold">${Number(product.price).toFixed(2)}</p>
              {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
                <p className="text-lg text-gray-500 line-through">${Number(product.comparePrice).toFixed(2)}</p>
              )}
              <div className="flex items-center text-secondary-600">
                <Heart className="h-5 w-5 mr-1" />
                <span>{product.likeCount || 0} likes</span>
              </div>
            </div>
            
            <p className="text-secondary-700 mb-6">
              {product.description}
            </p>
            
            {product.shortDescription && (
              <div className="border-t border-b py-6 mb-6">
                <h3 className="font-medium mb-4">Product Details:</h3>
                <p className="text-secondary-700">{product.shortDescription}</p>
                {product.careInstructions && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Care Instructions:</h4>
                    <p className="text-secondary-700">{product.careInstructions}</p>
                  </div>
                )}
              </div>
            )}
            
            {product.sizes && product.sizes.length > 0 && (
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
            )}
            
            {product.colors && product.colors.length > 0 && (
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
            )}
            
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
                onClick={handleToggleLike}
                className="btn-outline flex items-center justify-center gap-2 flex-1"
              >
                <Heart className="h-5 w-5" />
                Like
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