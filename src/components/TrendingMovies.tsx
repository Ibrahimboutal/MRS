import React from 'react';
import { Flame, TrendingUp, Star } from 'lucide-react';
import { Movie } from '../data/movies';
import { MovieCard } from './MovieCard';

interface TrendingMoviesProps {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
  userRatings: Record<number, number>;
  onRate: (movieId: number, rating: number) => void;
}

export function TrendingMovies({ movies, onMovieSelect, userRatings, onRate }: TrendingMoviesProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-semibold">Trending Now</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4" />
          <span>Updated hourly based on user activity</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie, index) => (
          <div key={movie.id} className="relative group">
            <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">#{index + 1} Trending</span>
            </div>
            <div className="transform transition-transform duration-200 group-hover:scale-[1.02]">
              <MovieCard
                movie={movie}
                onRate={(rating) => onRate(movie.id, rating)}
                userRating={userRatings[movie.id]}
                onClick={() => onMovieSelect(movie)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}