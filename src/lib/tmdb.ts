import { Movie, MovieDetails, Genre } from '../types/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  throw new Error('Missing TMDB API key. Please add VITE_TMDB_API_KEY to your .env file.');
}

export async function getTrendingMovies(page = 1): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`
  );
  const data = await response.json();
  return data.results.map(formatMovieResponse);
}

export async function getPopularMovies(page = 1): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
  );
  const data = await response.json();
  return data.results.map(formatMovieResponse);
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,similar,videos`
  );
  const data = await response.json();
  return formatMovieDetailsResponse(data);
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  const data = await response.json();
  return data.results.map(formatMovieResponse);
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<Movie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
  );
  const data = await response.json();
  return data.results.map(formatMovieResponse);
}

export async function getGenres(): Promise<Genre[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();
  return data.genres;
}

function formatMovieResponse(movie: any): Movie {
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path 
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : null,
    backdropPath: movie.backdrop_path
      ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`
      : null,
    overview: movie.overview,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    genreIds: movie.genre_ids || [],
  };
}

function formatMovieDetailsResponse(movie: any): MovieDetails {
  return {
    ...formatMovieResponse(movie),
    genres: movie.genres,
    runtime: movie.runtime,
    status: movie.status,
    tagline: movie.tagline,
    cast: movie.credits?.cast?.slice(0, 10).map((actor: any) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profilePath: actor.profile_path
        ? `${TMDB_IMAGE_BASE_URL}/w185${actor.profile_path}`
        : null,
    })),
    crew: movie.credits?.crew?.slice(0, 5).map((member: any) => ({
      id: member.id,
      name: member.name,
      job: member.job,
      department: member.department,
    })),
    similar: movie.similar?.results?.slice(0, 6).map(formatMovieResponse) || [],
    videos: movie.videos?.results
      ?.filter((video: any) => video.site === 'YouTube')
      .map((video: any) => ({
        id: video.id,
        key: video.key,
        name: video.name,
        type: video.type,
      })) || [],
  };
}