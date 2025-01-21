export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  genreIds: number[];
}

export interface MovieDetails extends Omit<Movie, 'genreIds'> {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  cast: CastMember[];
  crew: CrewMember[];
  similar: Movie[];
  videos: Video[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
}

export interface MovieFilters {
  genre?: number;
  year?: string;
  rating?: number;
  sortBy?: 'popularity' | 'rating' | 'release_date';
}