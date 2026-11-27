import { createFileRoute } from "@tanstack/react-router";
import { Header, Hero } from "@/components/hero";
import { Journey } from "@/components/journey";
import { Lab } from "@/components/lab";
import { Close, Lesson, Quiz } from "@/components/lesson";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Journey />
      <Lab />
      <Lesson />
      <Quiz />
      <Close />
    </main>
  );
}
