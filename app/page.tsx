import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Projects />
      </main>
    </>
  );
}
