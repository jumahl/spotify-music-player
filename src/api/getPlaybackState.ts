import { getErrorMessage } from "../helpers/getError";
import { CurrentlyPlayingContextObject } from "../helpers/spotify.api";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

export async function getPlaybackState() {
  const spotifyClient = getSpotifyClient();

  try {
    const response = await spotifyClient.getMePlayer({ additionalTypes: "episode" });
    if (response && response.status === 200) {
      return response.data as CurrentlyPlayingContextObject;
    }
    return undefined;
  } catch (err) {
    const error = getErrorMessage(err);
    console.log("getPlaybackState.ts Error:", error);
    throw new Error(error);
  }
}
