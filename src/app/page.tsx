import Counter from "@/components/Counter";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      <main className="flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            Next.js + Redux Toolkit + Tailwind CSS
          </h1>
          <p className="text-muted-foreground">
            Your project is ready to go!
          </p>
        </div>
        <Counter />
      </main>
    </div>
  );
}
