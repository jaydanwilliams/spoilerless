import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-8xl font-bold">Spoilerless</h1>
      <p className="text-lg text-pink-500">Track anime. Talk about it. No spoilers.</p>
      <Link href="/anime" className="rounded bg-black px-5 py-2 text-white">
        Browse anime
      </Link>
    </main>
  );
}
