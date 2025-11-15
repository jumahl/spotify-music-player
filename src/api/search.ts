import { getErrorMessage } from "../helpers/getError";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

type SearchProps = {
  query: string;
  limit?: number;
  types?: ("album" | "artist" | "playlist" | "track")[];
};

function filterNullItems<T>(category: { items?: (T | null)[] } | undefined) {
  if (!category?.items) return category;
  return {
    ...category,
    items: category.items.filter(Boolean) as T[],
  };
}

export async function search({ query, limit = 50, types = ["track", "artist", "album", "playlist"] }: SearchProps) {
  const spotifyClient = getSpotifyClient();

  try {
    const response = await spotifyClient.search(query, types, {
      limit,
    });

    if (response.status === 200) {
      return {
        tracks: filterNullItems(response.data.tracks),
        artists: filterNullItems(response.data.artists),
        albums: filterNullItems(response.data.albums),
        playlists: filterNullItems(response.data.playlists),
      };
    }

    return {
      tracks: undefined,
      artists: undefined,
      albums: undefined,
      playlists: undefined,
    };
  } catch (err) {
    const error = getErrorMessage(err);
    console.log("search.ts Error:", error);
    throw new Error(error);
  }
}
