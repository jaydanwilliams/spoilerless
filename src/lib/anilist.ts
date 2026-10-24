import { cache } from "react";

const ANILIST_URL = "https://graphql.anilist.co";

export type AnimeSummary = {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { large: string | null };
  episodes: number | null;
  seasonYear: number | null;
  format: string | null;
  averageScore: number | null;
};

export type SearchResult = {
  pageInfo: { currentPage: number; hasNextPage: boolean };
  media: AnimeSummary[];
};

const SEARCH_QUERY = `
  query ($search: String, $page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(search: $search, type: ANIME, sort: $sort) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        episodes
        seasonYear
        format
        averageScore
      }
    }
  }
`;

export async function searchAnime(search: string, page = 1, perPage = 20): Promise<SearchResult> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: {
        search: search || undefined,
        page,
        perPage,
        sort: [search ? "SEARCH_MATCH" : "POPULARITY_DESC"],
      },
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`AniList request failed with status ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`AniList returned errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data.Page;
}

export type AnimeDetail = AnimeSummary & {
  description: string | null;
  genres: string[];
  status: string | null;
  bannerImage: string | null;
};

const DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      bannerImage
      episodes
      seasonYear
      format
      averageScore
      description(asHtml: false)
      genres
      status
    }
  }
`;

export const getAnime = cache(async (id: number): Promise<AnimeDetail | null> => {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: DETAIL_QUERY, variables: { id } }),
    next: { revalidate: 3600 },
  });

  // AniList answers 404 when no anime has this ID
  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`AniList request failed with status ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`AniList returned errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data.Media;
});
