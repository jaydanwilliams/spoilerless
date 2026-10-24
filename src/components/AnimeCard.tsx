import Image from "next/image";
import Link from "next/link";
import type { AnimeSummary } from "@/lib/anilist";

export function AnimeCard({ anime, eager = false }: { anime: AnimeSummary; eager?: boolean }) {
  const title = anime.title.english ?? anime.title.romaji;

  return (
    <Link href={`/anime/${anime.id}`} className="group block">
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
        {anime.coverImage.large && (
          <Image
            src={anime.coverImage.large}
            alt={title}
            fill
            loading={eager ? "eager" : undefined}
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover transition group-hover:scale-105"
          />
        )}
      </div>
      <h2 className="mt-2 line-clamp-2 text-sm font-semibold">{title}</h2>
      <p className="text-xs text-gray-500">
        {anime.seasonYear ?? "TBA"} · {anime.episodes ? `${anime.episodes} eps` : "? eps"}
      </p>
    </Link>
  );
}
