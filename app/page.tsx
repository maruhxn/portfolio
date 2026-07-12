import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Skills />
      </main>
    </>
  );
}
