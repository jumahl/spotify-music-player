import { getErrorMessage } from "../helpers/getError";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

export async function play({ contextUri, uris }: { contextUri?: string; uris?: string[] } = {}) {
  const spotifyClient = getSpotifyClient();

  try {
    await spotifyClient.putMePlayerPlay({
      ...(uris ? { uris } : {}),
      ...(contextUri ? { context_uri: contextUri } : {}),
    });
  } catch (err) {
    const error = getErrorMessage(err);
    console.log("play.ts Error:", error);
    throw new Error(error);
  }
}
