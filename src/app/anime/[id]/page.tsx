import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnime } from "@/lib/anilist";

type Props = {
  params: Promise<{ id: string }>;
};

function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function cleanDescription(text: string | null): string {
  if (!text) return "No synopsis available.";
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function formatStatus(status: string | null): string {
  if (!status) return "Unknown";
  const readable = status.replace(/_/g, " ").toLowerCase();
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseId((await params).id);
  const anime = id ? await getAnime(id) : null;
  if (!anime) return { title: "Not found | Spoilerless" };
  return { title: `${anime.title.english ?? anime.title.romaji} | Spoilerless` };
}

export default async function AnimeDetailPage({ params }: Props) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const anime = await getAnime(id);
  if (!anime) notFound();

  const title = anime.title.english ?? anime.title.romaji;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/anime" className="text-sm text-gray-500 hover:underline">
        &larr; Back to browse
      </Link>

      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <div className="relative aspect-2/3 w-48 shrink-0 overflow-hidden rounded-lg bg-gray-200">
          {anime.coverImage.large && (
            <Image
              src={anime.coverImage.large}
              alt={title}
              fill
              loading="eager"
              sizes="192px"
              className="object-cover"
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {anime.title.english && <p className="text-gray-500">{anime.title.romaji}</p>}

          <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-gray-500">Format</dt>
              <dd className="font-medium">{anime.format ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Episodes</dt>
              <dd className="font-medium">{anime.episodes ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd className="font-medium">{formatStatus(anime.status)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Score</dt>
              <dd className="font-medium">{anime.averageScore ? `${anime.averageScore}/100` : "N/A"}</dd>
            </div>
          </dl>

          {anime.genres.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <li key={genre} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                  {genre}
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-6 text-lg font-semibold">Synopsis</h2>
          <p className="mt-2 whitespace-pre-line text-gray-700">{cleanDescription(anime.description)}</p>
        </div>
      </div>
    </main>
  );
}
