import { supabase } from "@/integrations/supabase/client";
import { MovieSummary } from "./omdb";

export async function getWatchlist(userId: string): Promise<MovieSummary[]> {
  const { data } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data || []).map((item: any) => ({
    imdbID: item.movie_id,
    Title: item.title,
    Year: item.year || "",
    Poster: item.poster || "N/A",
    Type: item.type || "movie",
  }));
}

export async function addToWatchlist(userId: string, movie: MovieSummary) {
  await supabase.from("watchlist").upsert({
    user_id: userId,
    movie_id: movie.imdbID,
    title: movie.Title,
    poster: movie.Poster,
    year: movie.Year,
    type: movie.Type,
  }, { onConflict: "user_id,movie_id" });
}

export async function removeFromWatchlist(userId: string, imdbID: string) {
  await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", imdbID);
}

export async function isInWatchlist(userId: string, imdbID: string): Promise<boolean> {
  const { data } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", imdbID)
    .maybeSingle();
  return !!data;
}
