import { useState } from 'react';
import { useShop } from '../contexts/ShopContext';

interface CommentSectionProps {
  productId: string;
}

function CommentSection({ productId }: CommentSectionProps) {
  const { getProductComments, addComment } = useShop();
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  
  const comments = getProductComments(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim() && userName.trim()) {
      addComment({
        userId: 'guest-user',
        userName,
        userImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        text: commentText,
        productId
      });
      
      // Clear form
      setCommentText('');
      setUserName('');
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-display font-medium mb-6">Customer Reviews</h3>
      
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="bg-secondary-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium mb-4">Add Your Review</h4>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-medium text-secondary-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="commentText" className="block text-sm font-medium text-secondary-700 mb-1">
              Your Review
            </label>
            <textarea
              id="commentText"
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Submit Review
          </button>
        </form>
      </div>
      
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img
                  src={comment.userImage}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full object-cover mr-4"
                />
                <div>
                  <h5 className="font-medium">{comment.userName}</h5>
                  <p className="text-sm text-secondary-500">{comment.date}</p>
                </div>
              </div>
              <p className="text-secondary-700">{comment.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-secondary-500">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
}

export default CommentSection;