import React, { useState } from 'react';
import { Star, Clock, Heart } from 'lucide-react';
import { Movie } from '../data/movies';

interface MovieCardProps {
  movie: Movie;
  onRate?: (rating: number) => void;
  userRating?: number;
  onClick?: () => void;
  showDetails?: boolean;
}

export function MovieCard({ movie, onRate, userRating, onClick, showDetails = true }: MovieCardProps) {
  const [liked, setLiked] = useState(false); // Track liked state

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={movie.imageUrl} 
          alt={movie.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-semibold text-white mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-white/90">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm">{movie.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm">•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">2h 15m</span>
            </div>
          </div>
        </div>
      </div>
      {showDetails && (
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{movie.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genre.map(g => (
              <span 
                key={g}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {g}
              </span>
            ))}
          </div>
          {onRate && (
            <div className="flex items-center justify-between border-t pt-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRate(rating);
                    }}
                    className={`p-1 transition-colors ${
                      userRating === rating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked((prev) => !prev); // Toggle liked state
                }}
              >
                <Heart className={`w-5 h-5 transition-colors ${liked ? 'text-red-500' : 'text-gray-500'}`} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
