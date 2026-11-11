import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { TechBand } from "@/components/sections/TechBand";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <TechBand />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
