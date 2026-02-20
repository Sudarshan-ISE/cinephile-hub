import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Search, ChevronDown, LogOut, Heart, User, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications(user?.id);
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

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const displayName = profile?.display_name || user?.email || "User";
  const avatarChar = displayName.charAt(0).toUpperCase();

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

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative text-foreground/80 transition-colors hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 border-border bg-card p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.movie_id) navigate(`/movie/${n.movie_id}`);
                    }}
                    className={`flex w-full flex-col gap-0.5 border-b border-border px-4 py-3 text-left transition-colors hover:bg-secondary/50 ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.message}</span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded bg-primary text-sm font-bold text-primary-foreground">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                avatarChar
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-foreground/60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-border bg-card">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer gap-2">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
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
