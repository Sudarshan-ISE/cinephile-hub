import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";
import { CATEGORIES } from "@/lib/omdb";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner />
      <div className="-mt-16 relative z-10 pb-16">
        {CATEGORIES.map((cat) => (
          <MovieRow key={cat.query} title={cat.title} query={cat.query} />
        ))}
      </div>
    </div>
  );
}
