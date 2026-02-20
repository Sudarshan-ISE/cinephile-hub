import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, MovieDetails as MovieDetailsType } from "@/lib/omdb";
import { useAuth } from "@/contexts/AuthContext";
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/watchlist";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Check, Star, Play } from "lucide-react";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inList, setInList] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetails(id).then(async (data) => {
      setMovie(data);
      setLoading(false);
      if (user && data) {
        const result = await isInWatchlist(user.id, data.imdbID);
        setInList(result);
      }
    });
  }, [id, user]);

  const toggleWatchlist = async () => {
    if (!user || !movie) return;
    if (inList) {
      await removeFromWatchlist(user.id, movie.imdbID);
      setInList(false);
    } else {
      await addToWatchlist(user.id, { imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Poster: movie.Poster, Type: movie.Type });
      setInList(true);
    }
  };

  const openTrailer = () => {
    if (!movie) return;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " " + movie.Year + " official trailer")}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Navbar />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Navbar />
        <p className="text-muted-foreground">Movie not found.</p>
      </div>
    );
  }

  const poster = movie.Poster !== "N/A" ? movie.Poster : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
        {poster && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${poster})`, filter: "blur(30px) brightness(0.3)", transform: "scale(1.3)" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="relative flex h-full items-end px-6 pb-8 md:px-12">
          <button onClick={() => navigate(-1)} className="absolute left-6 top-24 text-foreground/60 hover:text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex gap-6 md:gap-10">
            {poster && (
              <img src={poster} alt={movie.Title} className="hidden h-[300px] rounded-lg shadow-2xl md:block" />
            )}
            <div className="flex flex-col justify-end">
              <h1 className="mb-2 text-3xl font-extrabold text-foreground md:text-5xl">{movie.Title}</h1>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-yellow-400">
                  <Star className="h-4 w-4 fill-current" /> {movie.imdbRating}
                </span>
                <span>{movie.Year}</span>
                <span>{movie.Runtime}</span>
                <span>{movie.Rated}</span>
                <span>{movie.Genre}</span>
              </div>
              <div className="flex gap-3">
                <Button onClick={openTrailer} className="gap-2 bg-white text-black hover:bg-white/90">
                  <Play className="h-4 w-4 fill-current" /> Play Trailer
                </Button>
                <Button
                  onClick={toggleWatchlist}
                  variant={inList ? "secondary" : "default"}
                  className="gap-2"
                >
                  {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {inList ? "In My List" : "Add to My List"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 py-10 md:px-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-3 text-xl font-bold text-foreground">Plot</h2>
            <p className="leading-relaxed text-foreground/80">{movie.Plot}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-muted-foreground">Director: </span>
              <span className="text-foreground">{movie.Director}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cast: </span>
              <span className="text-foreground">{movie.Actors}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Writer: </span>
              <span className="text-foreground">{movie.Writer}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Language: </span>
              <span className="text-foreground">{movie.Language}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Awards: </span>
              <span className="text-foreground">{movie.Awards}</span>
            </div>
            {movie.BoxOffice && (
              <div>
                <span className="text-muted-foreground">Box Office: </span>
                <span className="text-foreground">{movie.BoxOffice}</span>
              </div>
            )}

            {movie.Ratings?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 font-bold text-foreground">Ratings</h3>
                <div className="space-y-2">
                  {movie.Ratings.map((r) => (
                    <div key={r.Source} className="flex justify-between rounded bg-secondary/50 px-3 py-2">
                      <span className="text-muted-foreground">{r.Source}</span>
                      <span className="font-medium text-foreground">{r.Value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
