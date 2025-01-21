export interface Movie {
  id: number;
  title: string;
  genre: string[];
  rating: number;
  imageUrl: string;
  description: string;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "The Adventure Begins",
    genre: ["Adventure", "Action"],
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80",
    description: "An epic adventure that takes you through uncharted territories."
  },
  {
    id: 2,
    title: "Mystery of the Night",
    genre: ["Mystery", "Thriller"],
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80",
    description: "A thrilling mystery that keeps you guessing until the end."
  },
  {
    id: 3,
    title: "Love in Paris",
    genre: ["Romance", "Drama"],
    rating: 4.0,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
    description: "A romantic tale set in the heart of Paris."
  },
  {
    id: 4,
    title: "Space Odyssey",
    genre: ["Sci-Fi", "Adventure"],
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80",
    description: "An interstellar journey beyond imagination."
  },
  {
    id: 5,
    title: "Comedy Hour",
    genre: ["Comedy"],
    rating: 3.8,
    imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80",
    description: "A hilarious comedy that will keep you laughing."
  }
];