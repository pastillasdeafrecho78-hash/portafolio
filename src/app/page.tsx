import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { WorkScope } from "@/components/sections/WorkScope";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { Benefits } from "@/components/sections/Benefits";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <WorkScope />
        <Projects />
        <Process />
        <Benefits />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
