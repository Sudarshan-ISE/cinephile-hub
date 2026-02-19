import { MovieSummary } from "./omdb";

const WATCHLIST_KEY = "netflix_clone_watchlist";

function getKey(userId: string) {
  return `${WATCHLIST_KEY}_${userId}`;
}

export function getWatchlist(userId: string): MovieSummary[] {
  try {
    return JSON.parse(localStorage.getItem(getKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export function addToWatchlist(userId: string, movie: MovieSummary) {
  const list = getWatchlist(userId);
  if (!list.find((m) => m.imdbID === movie.imdbID)) {
    list.push(movie);
    localStorage.setItem(getKey(userId), JSON.stringify(list));
  }
}

export function removeFromWatchlist(userId: string, imdbID: string) {
  const list = getWatchlist(userId).filter((m) => m.imdbID !== imdbID);
  localStorage.setItem(getKey(userId), JSON.stringify(list));
}

export function isInWatchlist(userId: string, imdbID: string): boolean {
  return getWatchlist(userId).some((m) => m.imdbID === imdbID);
}
