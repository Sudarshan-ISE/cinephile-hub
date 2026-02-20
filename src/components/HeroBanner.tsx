import { useEffect, useState } from "react";
import { getMovieDetails, MovieDetails, HERO_MOVIES } from "@/lib/omdb";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all(HERO_MOVIES.map(getMovieDetails)).then((results) => {
      setMovies(results.filter(Boolean) as MovieDetails[]);
    });
  }, []);

  useEffect(() => {
    if (movies.length < 2) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % movies.length), 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const movie = movies[current];
  if (!movie) {
    return <div className="h-[70vh] bg-background" />;
  }

  const backdrop = movie.Poster !== "N/A" ? movie.Poster : "";

  const openTrailer = () => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " " + movie.Year + " official trailer")}`, "_blank");
  };

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {backdrop && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${backdrop})`, filter: "blur(20px) brightness(0.4)", transform: "scale(1.2)" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />

      <div className="relative flex h-full items-end px-6 pb-24 md:px-12">
        <div className="max-w-2xl animate-slide-up">
          <h1 className="mb-3 text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
            {movie.Title}
          </h1>
          <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="font-semibold text-green-400">{movie.imdbRating}/10</span>
            <span>{movie.Year}</span>
            <span>{movie.Runtime}</span>
            <span>{movie.Rated}</span>
          </div>
          <p className="mb-6 line-clamp-3 max-w-lg text-sm leading-relaxed text-foreground/80 md:text-base">
            {movie.Plot}
          </p>
          <div className="flex gap-3">
            <Button
              size="lg"
              className="gap-2 bg-white text-black hover:bg-white/90"
              onClick={openTrailer}
            >
              <Play className="h-5 w-5 fill-current" /> Play
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              onClick={() => navigate(`/movie/${movie.imdbID}`)}
            >
              <Info className="h-5 w-5" /> More Info
            </Button>
          </div>

          {movies.length > 1 && (
            <div className="mt-6 flex gap-2">
              {movies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-4 bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
