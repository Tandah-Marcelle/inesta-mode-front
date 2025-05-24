import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const selectImage = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="relative">
      {/* Main image */}
      <div className="mb-4 overflow-hidden rounded-lg aspect-[3/4] bg-gray-100">
        <LazyLoadImage
          src={images[currentImage]}
          alt={`${name} - View ${currentImage + 1}`}
          effect="opacity"
          className="w-full h-full object-cover"
          wrapperClassName="w-full h-full"
        />
      </div>
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage} 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextImage} 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      
      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={`overflow-hidden rounded-md border-2 transition-all ${
                currentImage === index ? 'border-primary-600 opacity-100' : 'border-transparent opacity-70'
              }`}
            >
              <img 
                src={image} 
                alt={`${name} thumbnail ${index + 1}`}
                className="w-16 h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageGallery;