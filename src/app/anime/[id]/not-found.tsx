import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Anime not found</h1>
      <p className="mt-2 text-gray-600">We couldn&apos;t find an anime with that ID.</p>
      <Link href="/anime" className="mt-4 inline-block rounded bg-black px-4 py-2 text-white">
        Browse anime
      </Link>
    </main>
  );
}
