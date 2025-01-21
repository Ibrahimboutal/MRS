import React, { useState } from 'react';
import { Users, MessageSquare, Share2 } from 'lucide-react';
import { Movie } from '../data/movies';

interface SocialFeaturesProps {
  movie: Movie;
  onShare: (platform: string) => void;
}

export function SocialFeatures({ movie, onShare }: SocialFeaturesProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Alice', text: 'Great movie!', timestamp: new Date().toISOString() },
    { id: 2, user: 'Bob', text: 'The ending was amazing!', timestamp: new Date().toISOString() }
  ]);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments(prev => [
        ...prev,
        {
          id: prev.length + 1,
          user: 'You',
          text: comment,
          timestamp: new Date().toISOString()
        }
      ]);
      setComment('');
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold">Social</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onShare('twitter')}
            className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleComment} className="flex gap-2 mb-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {comment.user[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{comment.user}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}