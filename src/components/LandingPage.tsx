import React from 'react';
import { Play, Star, Users, Film, TrendingUp, Heart } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80"
            alt="Movie Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Personal Movie Journey Starts Here
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover, rate, and share your favorite movies. Get personalized recommendations and join a community of movie enthusiasts.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors gap-2"
          >
            <Play className="w-5 h-5" />
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Star className="w-8 h-8 text-yellow-400" />}
            title="Rate & Review"
            description="Share your thoughts on movies and help others discover great content."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-blue-400" />}
            title="Trending Movies"
            description="Stay updated with what's popular and trending in the movie world."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-green-400" />}
            title="Community"
            description="Connect with other movie enthusiasts and share recommendations."
          />
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-gray-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Action', 'Drama', 'Comedy', 'Sci-Fi'].map((genre) => (
              <div
                key={genre}
                className="relative group overflow-hidden rounded-lg aspect-video cursor-pointer"
              >
                <img
                  src={`https://images.unsplash.com/photo-${getGenreImage(genre)}?auto=format&fit=crop&q=80`}
                  alt={genre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <span className="text-white font-semibold p-4">{genre}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Movie Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers and start exploring today.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors gap-2"
          >
            <Film className="w-5 h-5" />
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="bg-gray-700/50 rounded-lg p-3 w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function getGenreImage(genre: string): string {
  const images = {
    'Action': '1536440136628-849c177e76a1',
    'Drama': '1485846234645-a62644f84728',
    'Comedy': '1517604931442-7e0c8ed2963c',
    'Sci-Fi': '1446776811953-b23d57bd21aa',
  };
  return images[genre as keyof typeof images];
}