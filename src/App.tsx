import React, { useState, useEffect } from 'react';
import { MovieCard } from './components/MovieCard';
import { MovieDetails } from './components/MovieDetails';
import { SearchBar, SearchFilters } from './components/SearchBar';
import { AuthForm } from './components/AuthForm';
import { TrendingMovies } from './components/TrendingMovies';
import { LandingPage } from './components/LandingPage';
import { movies } from './data/movies';
import { getRecommendations, getTrendingMovies } from './utils/recommendations';
import { Settings, LogOut, AlertCircle } from 'lucide-react';
import { supabase, checkConnection } from './lib/supabase';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});
  const [recommendations, setRecommendations] = useState(movies.slice(0, 3));
  const [trendingMovies, setTrendingMovies] = useState(movies.slice(0, 3));
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeConnection = async () => {
      const connected = await checkConnection();
      setIsConnected(connected);
      if (!connected) {
        setError('Unable to connect to the database. Please check your connection and try again.');
      }
    };

    initializeConnection();
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isConnected]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  useEffect(() => {
    const newRecommendations = getRecommendations(
      movies,
      userPreferences,
      userRatings
    );
    setRecommendations(newRecommendations);

    const newTrendingMovies = getTrendingMovies(movies, userRatings);
    setTrendingMovies(newTrendingMovies);
  }, [userPreferences, userRatings]);

  const handleRating = async (movieId: number, rating: number) => {
    if (!user) return;

    try {
      setUserRatings(prev => ({
        ...prev,
        [movieId]: rating
      }));
      
      const { error } = await supabase
        .from('movie_ratings')
        .upsert(
          { 
            user_id: user.id, 
            movie_id: movieId, 
            rating 
          },
          {
            onConflict: 'user_id,movie_id',
            ignoreDuplicates: false
          }
        );

      if (error) {
        setError('Failed to save rating. Please try again.');
        // Revert the optimistic update
        setUserRatings(prev => {
          const newRatings = { ...prev };
          delete newRatings[movieId];
          return newRatings;
        });
      }
    } catch (err) {
      console.error('Error saving rating:', err);
      setError('Failed to save rating. Please try again.');
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load user profile with error handling
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('preferred_genres')
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // If no profile exists, create one
      if (!profiles || profiles.length === 0) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, preferred_genres: [] }]);

        if (insertError) throw insertError;
        setUserPreferences([]);
      } else {
        setUserPreferences(profiles[0].preferred_genres || []);
      }

      // Load ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from('movie_ratings')
        .select('movie_id, rating')
        .eq('user_id', user.id);

      if (ratingsError) throw ratingsError;

      if (ratings) {
        const ratingsMap = ratings.reduce((acc, { movie_id, rating }) => ({
          ...acc,
          [movie_id]: rating
        }), {});
        setUserRatings(ratingsMap);
      }

      // Load watchlist
      const { data: watchlistData, error: watchlistError } = await supabase
        .from('watchlist')
        .select('movie_id')
        .eq('user_id', user.id);

      if (watchlistError) throw watchlistError;

      if (watchlistData) {
        setWatchlist(watchlistData.map(item => item.movie_id));
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load your profile data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string, filters: SearchFilters) => {
    let results = movies;

    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.genre.length > 0) {
      results = results.filter(movie =>
        movie.genre.some(g => filters.genre.includes(g))
      );
    }

    if (filters.rating) {
      results = results.filter(movie =>
        movie.rating >= parseInt(filters.rating)
      );
    }

    setFilteredMovies(results);
  };

  const handleAddToWatchlist = async (movieId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({ user_id: user.id, movie_id: movieId });

      if (error) throw error;

      setWatchlist(prev => [...prev, movieId]);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      setError('Failed to add movie to watchlist. Please try again.');
    }
  };

  const handleLikeMovie = async (movieId: number) => {
    if (!user) return;

    setLikedMovies(prev => 
      prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUserPreferences([]);
      setUserRatings({});
      setWatchlist([]);
      setLikedMovies([]);
    } catch (err) {
      setError('Failed to sign out. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user && !showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <AuthForm type="login" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Movie Recommendations</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Preferences
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        {showPreferences && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Select Your Preferred Genres</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(movies.flatMap(movie => movie.genre))).map(genre => (
                <button
                  key={genre}
                  onClick={() => {
                    const newPreferences = userPreferences.includes(genre)
                      ? userPreferences.filter(g => g !== genre)
                      : [...userPreferences, genre];
                    
                    setUserPreferences(newPreferences);
                    supabase
                      .from('profiles')
                      .update({ preferred_genres: newPreferences })
                      .eq('user_id', user.id)
                      .then(({ error }) => {
                        if (error) {
                          setError('Failed to update preferences. Please try again.');
                        }
                      });
                  }}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    userPreferences.includes(genre)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-8">
          <TrendingMovies
            movies={trendingMovies}
            onMovieSelect={setSelectedMovie}
            userRatings={userRatings}
            onRate={handleRating}
          />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRate={(rating) => handleRating(movie.id, rating)}
                  userRating={userRatings[movie.id]}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">All Movies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRate={(rating) => handleRating(movie.id, rating)}
                  userRating={userRatings[movie.id]}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          </div>
        </div>

        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onAddToWatchlist={() => handleAddToWatchlist(selectedMovie.id)}
            onLike={() => handleLikeMovie(selectedMovie.id)}
          />
        )}
      </div>
    </div>
  );
}

export default App;