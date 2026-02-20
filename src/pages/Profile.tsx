import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Camera, Save } from "lucide-react";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Adventure", "Animation", "Documentary"];

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setFavoriteGenre(profile.favorite_genre || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio,
        favorite_genre: favoriteGenre,
        avatar_url: avatarUrl,
      } as any)
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated!");
      refreshProfile();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-24">
        <h1 className="mb-8 text-3xl font-extrabold text-foreground">Profile Settings</h1>

        <div className="rounded-2xl border border-border bg-card p-8">
          {/* Avatar */}
          <div className="mb-8 flex items-center gap-6">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                displayName?.charAt(0)?.toUpperCase() || <User className="h-8 w-8" />
              )}
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Avatar URL</label>
              <Input
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="border-border bg-secondary text-foreground"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-border bg-secondary text-foreground"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Email</label>
              <Input value={user?.email || ""} disabled className="border-border bg-secondary/50 text-muted-foreground" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground/80">Favorite Genre</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setFavoriteGenre(genre)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      favoriteGenre === genre
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full gap-2 text-base font-semibold" size="lg">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
