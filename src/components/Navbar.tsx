import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, ChevronDown, LogOut, Heart, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent px-6 py-4 transition-all">
      <div className="flex items-center gap-8">
        <Link to="/">
          <h1 className="text-2xl font-extrabold tracking-tighter text-primary">NETFLUX</h1>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/watchlist" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            My List
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center">
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-sm border border-white/20 bg-black/80 px-3 py-1.5 animate-fade-in">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Titles, people, genres"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearchOpen(false)}
                autoFocus
                className="w-40 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none md:w-56"
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </form>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <ChevronDown className="h-4 w-4 text-foreground/60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-border bg-card">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/watchlist")} className="cursor-pointer gap-2">
              <Heart className="h-4 w-4" /> My List
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-primary focus:text-primary">
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
