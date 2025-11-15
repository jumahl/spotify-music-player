import { getErrorMessage } from "../helpers/getError";
import { EpisodeObject, TrackObject } from "../helpers/spotify.api";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

export async function getCurrentlyPlaying() {
  const spotifyClient = getSpotifyClient();

  try {
    const response = await spotifyClient.getMePlayerCurrentlyPlaying({ additionalTypes: "episode" });
    if (response && response.status === 200) {
      return {
        ...response,
        item: response.data.item as unknown as EpisodeObject | TrackObject,
      };
    }
    return undefined;
  } catch (err) {
    const error = getErrorMessage(err);
    console.log("getCurrentlyPlaying.ts Error:", error);
    throw new Error(error);
  }
}
