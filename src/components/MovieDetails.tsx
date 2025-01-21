import React, { useState } from 'react';
import { Star, Heart, Share2, Plus, MessageCircle } from 'lucide-react';
import { Movie } from '../data/movies';
import { SocialFeatures } from './SocialFeatures';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  onAddToWatchlist?: () => void;
  onLike?: () => void;
}

export function MovieDetails({ movie, onClose, onAddToWatchlist, onLike }: MovieDetailsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit review to backend
    setShowReviewForm(false);
    setReview('');
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${movie.title} on our movie platform!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      // Add more social platforms here
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">{movie.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>2023</span>
                <span>2h 15m</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1">{movie.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onLike}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart className="w-6 h-6" />
              </button>
              <button 
                onClick={onAddToWatchlist}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Plus className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{movie.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genre.map(g => (
                <span
                  key={g}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Reviews</h3>
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <MessageCircle className="w-4 h-4" />
                Write a Review
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="mb-4">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full p-3 border border-gray-300 rounded-md mb-2"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <div className="flex items-center">
                      {Array(5).fill(null).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">Great movie! The plot was engaging and the acting was superb.</p>
              </div>
            </div>
          </div>

          <SocialFeatures movie={movie} onShare={handleShare} />
        </div>
      </div>
    </div>
  );
}