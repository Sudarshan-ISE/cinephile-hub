import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      toast.error(result.error || "Login failed.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80)" }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute left-8 top-6 z-20">
        <h1 className="text-3xl font-extrabold tracking-tighter text-primary">NETFLUX</h1>
      </div>

      <div className="relative z-10 mx-4 w-full max-w-md animate-fade-in rounded-2xl border border-white/10 bg-black/60 p-10 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-2 text-3xl font-bold text-foreground">Sign In</h2>
        <p className="mb-8 text-muted-foreground">Welcome back! Sign in to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/80">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/80">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
          <Button type="submit" className="w-full text-base font-semibold" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          New to Netflux?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
