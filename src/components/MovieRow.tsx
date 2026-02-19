import { useEffect, useState, useRef } from "react";
import { searchMovies, MovieSummary } from "@/lib/omdb";
import MovieCard from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  query: string;
}

export default function MovieRow({ title, query }: Props) {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    searchMovies(query).then(({ movies }) => setMovies(movies));
  }, [query]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <div className="group/row mb-8">
      <h2 className="mb-3 px-6 text-lg font-bold text-foreground md:text-xl">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover/row:flex group-hover/row:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto px-6 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 z-10 hidden h-full w-10 items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover/row:flex group-hover/row:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
