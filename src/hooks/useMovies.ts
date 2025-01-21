import useSWR from 'swr';
import { Movie, MovieDetails, MovieFilters } from '../types/movie';
import * as tmdb from '../lib/tmdb';

export function useTrendingMovies(page = 1) {
  return useSWR<Movie[]>(['trending', page], () => tmdb.getTrendingMovies(page));
}

export function usePopularMovies(page = 1) {
  return useSWR<Movie[]>(['popular', page], () => tmdb.getPopularMovies(page));
}

export function useMovieDetails(movieId: number) {
  return useSWR<MovieDetails>(['movie', movieId], () => tmdb.getMovieDetails(movieId));
}

export function useMovieSearch(query: string, page = 1) {
  return useSWR<Movie[]>(
    query ? ['search', query, page] : null,
    () => tmdb.searchMovies(query, page)
  );
}

export function useMoviesByGenre(genreId: number, page = 1) {
  return useSWR<Movie[]>(
    ['genre', genreId, page],
    () => tmdb.getMoviesByGenre(genreId, page)
  );
}

export function useGenres() {
  return useSWR('genres', tmdb.getGenres);
}