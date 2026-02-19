const API_KEY = "57003d72";
const BASE_URL = "https://www.omdbapi.com";

export interface MovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface MovieDetails extends MovieSummary {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  BoxOffice?: string;
}

export async function searchMovies(query: string, page = 1): Promise<{ movies: MovieSummary[]; totalResults: number }> {
  const res = await fetch(`${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
  const data = await res.json();
  if (data.Response === "True") {
    return { movies: data.Search, totalResults: parseInt(data.totalResults) };
  }
  return { movies: [], totalResults: 0 };
}

export async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  const res = await fetch(`${BASE_URL}/?apikey=${API_KEY}&i=${encodeURIComponent(id)}&plot=full`);
  const data = await res.json();
  return data.Response === "True" ? data : null;
}

// Predefined search terms for categories
export const CATEGORIES = [
  { title: "Trending Now", query: "marvel" },
  { title: "Action", query: "action" },
  { title: "Comedy", query: "comedy" },
  { title: "Drama", query: "drama" },
  { title: "Sci-Fi", query: "space" },
  { title: "Thriller", query: "thriller" },
  { title: "Horror", query: "horror" },
  { title: "Adventure", query: "adventure" },
] as const;

// Featured movies for hero banner
export const HERO_MOVIES = [
  "tt4154796", // Avengers: Endgame
  "tt1375666", // Inception
  "tt0468569", // The Dark Knight
  "tt0816692", // Interstellar
  "tt0111161", // The Shawshank Redemption
];
