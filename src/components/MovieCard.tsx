import { Link } from "react-router-dom";
import { MovieSummary } from "@/lib/omdb";
import { Play, Plus, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import { useState, useEffect } from "react";

interface Props {
  movie: MovieSummary;
}

export default function MovieCard({ movie }: Props) {
  const { user } = useAuth();
  const [inList, setInList] = useState(false);

  useEffect(() => {
    if (user) {
      isInWatchlist(user.id, movie.imdbID).then(setInList);
    }
  }, [user, movie.imdbID]);

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (inList) {
      await removeFromWatchlist(user.id, movie.imdbID);
      setInList(false);
    } else {
      await addToWatchlist(user.id, movie);
      setInList(true);
    }
  };

  const openTrailer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " " + movie.Year + " official trailer")}`, "_blank");
  };

  const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="group relative flex-shrink-0 overflow-hidden rounded-md transition-transform duration-300 hover:z-10 hover:scale-110"
    >
      <img
        src={poster}
        alt={movie.Title}
        className="h-[200px] w-[140px] object-cover sm:h-[250px] sm:w-[170px]"
        loading="lazy"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-sm font-semibold leading-tight text-white">{movie.Title}</h3>
        <p className="mt-0.5 text-xs text-white/60">{movie.Year}</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={openTrailer}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
          </button>
          <button
            onClick={toggleWatchlist}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white transition-all hover:border-white hover:scale-110"
          >
            {inList ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
