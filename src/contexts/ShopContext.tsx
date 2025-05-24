import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dress, Comment } from '../types';
import { allDresses } from '../data/dresses';
import { comments as initialComments } from '../data/comments';

interface ShopContextType {
  dresses: Dress[];
  cart: Dress[];
  comments: Comment[];
  addToCart: (dress: Dress) => void;
  removeFromCart: (dressId: string) => void;
  toggleLike: (dressId: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  getProductComments: (productId: string) => Comment[];
}

const ShopContext = createContext<ShopContextType | null>(null);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider = ({ children }: ShopProviderProps) => {
  const [dresses, setDresses] = useState<Dress[]>(() => {
    return allDresses.map(dress => ({ ...dress, liked: false }));
  });
  
  const [cart, setCart] = useState<Dress[]>([]);
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const addToCart = (dress: Dress) => {
    setCart(prevCart => [...prevCart, dress]);
  };

  const removeFromCart = (dressId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== dressId));
  };

  const toggleLike = (dressId: string) => {
    setDresses(prevDresses => {
      return prevDresses.map(dress => {
        if (dress.id === dressId) {
          const liked = !dress.liked;
          return {
            ...dress,
            liked,
            likes: liked ? dress.likes + 1 : dress.likes - 1
          };
        }
        return dress;
      });
    });
  };

  const addComment = (comment: Omit<Comment, 'id' | 'date'>) => {
    const newComment: Comment = {
      ...comment,
      id: `com${comments.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };
    
    setComments(prevComments => [...prevComments, newComment]);
  };

  const getProductComments = (productId: string) => {
    return comments.filter(comment => comment.productId === productId);
  };

  return (
    <ShopContext.Provider value={{
      dresses,
      cart,
      comments,
      addToCart,
      removeFromCart,
      toggleLike,
      addComment,
      getProductComments
    }}>
      {children}
    </ShopContext.Provider>
  );
};