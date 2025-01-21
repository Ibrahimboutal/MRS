import { Movie } from '../data/movies';

interface MovieScore extends Movie {
  score: number;
}

interface WeightedPreference {
  genre: string;
  weight: number;
}

export function getRecommendations(
  movies: Movie[],
  userPreferences: string[],
  userRatings: Record<number, number>,
  recentlyViewed: number[] = []
): Movie[] {
  const userRatingValues = Object.values(userRatings);
  const averageUserRating = userRatingValues.length
    ? userRatingValues.reduce((a, b) => a + b, 0) / userRatingValues.length
    : 0;

  const genreWeights = calculateGenreWeights(movies, userRatings);
  
  const scoredMovies: MovieScore[] = movies.map(movie => {
    if (recentlyViewed.includes(movie.id)) {
      return { ...movie, score: -Infinity }; // Exclude recently viewed movies
    }

    let score = 0;
    
    // Genre matching with weighted preferences (30% of total score)
    score += calculateGenreScore(movie, userPreferences, genreWeights) * 0.3;
    
    // Rating-based scoring (25% of total score)
    score += calculateRatingScore(movie, userRatings, averageUserRating) * 0.25;
    
    // Collaborative filtering (25% of total score)
    score += calculateCollaborativeScore(movie, movies, userRatings) * 0.25;
    
    // Diversity and novelty (20% of total score)
    score += calculateDiversityScore(movie, userRatings) * 0.2;
    
    return { ...movie, score };
  });
  
  return diversifyRecommendations(scoredMovies);
}

export function getTrendingMovies(
  movies: Movie[],
  userRatings: Record<number, number>
): Movie[] {
  const now = Date.now();
  const HOUR_MS = 60 * 60 * 1000;
  
  const scoredMovies = movies.map(movie => {
    let score = 0;

    // Base score from movie rating (40% weight)
    score += (movie.rating / 5) * 0.4;

    // User engagement score (30% weight)
    const engagementScore = Object.keys(userRatings).length > 0 ? 0.3 : 0;
    score += engagementScore;

    // Recency boost (20% weight)
    const recencyScore = Math.random(); // Simulated recency, would use actual timestamp in production
    score += recencyScore * 0.2;

    // Popularity factor (10% weight)
    const popularityScore = Math.min(Object.keys(userRatings).length / 10, 1) * 0.1;
    score += popularityScore;

    return { ...movie, score };
  });

  return scoredMovies
    .sort((a, b) => (b as MovieScore).score - (a as MovieScore).score)
    .slice(0, 3);
}

export function getBecauseYouWatched(
  movies: Movie[],
  watchedMovie: Movie,
  userRatings: Record<number, number>
): Movie[] {
  const similarMovies = movies
    .filter(movie => movie.id !== watchedMovie.id)
    .map(movie => {
      let score = 0;
      
      // Genre similarity (40%)
      const genreOverlap = movie.genre.filter(g => 
        watchedMovie.genre.includes(g)
      ).length;
      score += (genreOverlap / Math.max(movie.genre.length, watchedMovie.genre.length)) * 0.4;
      
      // Rating similarity (30%)
      const ratingDiff = Math.abs(movie.rating - watchedMovie.rating);
      score += ((5 - ratingDiff) / 5) * 0.3;
      
      // User preference boost (30%)
      if (userRatings[movie.id]) {
        score += (userRatings[movie.id] / 5) * 0.3;
      }
      
      return { ...movie, score };
    })
    .sort((a, b) => (b as MovieScore).score - (a as MovieScore).score)
    .slice(0, 3);
    
  return similarMovies;
}

function calculateGenreWeights(
  movies: Movie[],
  userRatings: Record<number, number>
): Map<string, number> {
  const weights = new Map<string, number>();
  const genreCounts = new Map<string, { total: number; count: number }>();

  movies.forEach(movie => {
    if (userRatings[movie.id]) {
      movie.genre.forEach(genre => {
        const current = genreCounts.get(genre) || { total: 0, count: 0 };
        current.total += userRatings[movie.id];
        current.count += 1;
        genreCounts.set(genre, current);
      });
    }
  });

  genreCounts.forEach((value, genre) => {
    weights.set(genre, value.total / value.count);
  });

  return weights;
}

function calculateGenreScore(
  movie: Movie,
  userPreferences: string[],
  genreWeights: Map<string, number>
): number {
  let score = 0;
  
  movie.genre.forEach(genre => {
    if (userPreferences.includes(genre)) {
      score += 2;
    }
    
    const weight = genreWeights.get(genre) || 1;
    score += weight;
  });
  
  return score / movie.genre.length;
}

function calculateRatingScore(
  movie: Movie,
  userRatings: Record<number, number>,
  averageUserRating: number
): number {
  if (userRatings[movie.id]) {
    return -10; // Ensure rated movies aren't recommended
  }

  const ratingDifference = Math.abs(movie.rating - averageUserRating);
  return (5 - ratingDifference) / 2;
}

function calculateCollaborativeScore(
  movie: Movie,
  allMovies: Movie[],
  userRatings: Record<number, number>
): number {
  const similarMovies = allMovies.filter(m => 
    m.id !== movie.id && 
    m.genre.some(g => movie.genre.includes(g))
  );
  
  const similarityScores = similarMovies.map(similarMovie => {
    if (!userRatings[similarMovie.id]) return 0;
    
    const genreOverlap = similarMovie.genre.filter(g => 
      movie.genre.includes(g)
    ).length / similarMovie.genre.length;
    
    return userRatings[similarMovie.id] * genreOverlap;
  });
  
  return similarityScores.length
    ? similarityScores.reduce((a, b) => a + b, 0) / similarityScores.length
    : 0;
}

function calculateDiversityScore(
  movie: Movie,
  userRatings: Record<number, number>
): number {
  const randomFactor = Math.random() * 0.5;
  const genrePopularity = movie.genre.length;
  const diversityBoost = 1 / genrePopularity;
  
  return randomFactor + diversityBoost;
}

function diversifyRecommendations(scoredMovies: MovieScore[]): Movie[] {
  const recommendations: MovieScore[] = [];
  const genreCounts = new Map<string, number>();
  
  const sortedMovies = [...scoredMovies].sort((a, b) => b.score - a.score);
  
  for (const movie of sortedMovies) {
    const hasOverrepresentedGenre = movie.genre.some(genre => 
      (genreCounts.get(genre) || 0) >= 2
    );
    
    if (!hasOverrepresentedGenre && recommendations.length < 6) {
      recommendations.push(movie);
      movie.genre.forEach(genre => {
        genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
      });
    }
  }
  
  return recommendations;
}