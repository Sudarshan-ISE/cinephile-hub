import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies, MovieSummary } from "@/lib/omdb";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q) {
      setQuery(q);
      setLoading(true);
      setSearched(true);
      searchMovies(q).then(({ movies }) => {
        setMovies(movies);
        setLoading(false);
      });
    }
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    searchMovies(query.trim()).then(({ movies }) => {
      setMovies(movies);
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-6 pb-16 pt-24 md:px-12">
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </form>

        {loading && <p className="text-center text-muted-foreground">Searching...</p>}

        {!loading && searched && movies.length === 0 && (
          <p className="text-center text-muted-foreground">No results found for "{q || query}"</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
