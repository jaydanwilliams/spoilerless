import Link from "next/link";
import { AnimeCard } from "@/components/AnimeCard";
import { searchAnime } from "@/lib/anilist";

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function AnimePage({ searchParams }: Props) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const { media, pageInfo } = await searchAnime(q, currentPage);

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(p));
    return `/anime?${params.toString()}`;
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Browse anime</h1>

      <form action="/anime" className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search for an anime..."
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Search
        </button>
      </form>

      {media.length === 0 ? (
        <p className="mt-8 text-gray-500">No results for &ldquo;{q}&rdquo;.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {media.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        {currentPage > 1 ? <Link href={pageHref(currentPage - 1)}>&larr; Previous</Link> : <span />}
        <span className="text-sm text-gray-500">Page {currentPage}</span>
        {pageInfo.hasNextPage ? <Link href={pageHref(currentPage + 1)}>Next &rarr;</Link> : <span />}
      </div>
    </main>
  );
}
