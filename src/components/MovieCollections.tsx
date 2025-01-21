import React from 'react';
import { Sparkles, Zap, History } from 'lucide-react';
import { Movie } from '../data/movies';
import { MovieCard } from './MovieCard';

interface MovieCollectionsProps {
  forYou: Movie[];
  becauseYouWatched: Movie[];
  recentlyViewed: Movie[];
  onMovieSelect: (movie: Movie) => void;
  userRatings: Record<number, number>;
  onRate: (movieId: number, rating: number) => void;
}

export function MovieCollections({
  forYou,
  becauseYouWatched,
  recentlyViewed,
  onMovieSelect,
  userRatings,
  onRate
}: MovieCollectionsProps) {
  return (
    <div className="space-y-12">
      {/* For You Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-semibold">Picked for You</h2>
          </div>
          <span className="text-sm text-gray-600">Based on your preferences</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forYou.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRate={(rating) => onRate(movie.id, rating)}
              userRating={userRatings[movie.id]}
              onClick={() => onMovieSelect(movie)}
            />
          ))}
        </div>
      </section>

      {/* Because You Watched Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-semibold">Because You Watched</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {becauseYouWatched.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRate={(rating) => onRate(movie.id, rating)}
              userRating={userRatings[movie.id]}
              onClick={() => onMovieSelect(movie)}
            />
          ))}
        </div>
      </section>

      {/* Recently Viewed Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold">Recently Viewed</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyViewed.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRate={(rating) => onRate(movie.id, rating)}
              userRating={userRatings[movie.id]}
              onClick={() => onMovieSelect(movie)}
              showDetails={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}