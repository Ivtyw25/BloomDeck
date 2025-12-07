import Hero from "@/components/section/Hero";
import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen selection:bg-green-100 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}
