import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { MovieSummary } from "@/lib/omdb";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";

export default function Watchlist() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<MovieSummary[]>([]);

  useEffect(() => {
    if (user) setMovies(getWatchlist(user.id));
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-6 pb-16 pt-24 md:px-12">
        <h1 className="mb-8 text-3xl font-extrabold text-foreground">My List</h1>

        {movies.length === 0 ? (
          <p className="text-muted-foreground">Your watchlist is empty. Browse movies and add them here!</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
