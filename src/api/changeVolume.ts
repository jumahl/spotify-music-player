import { showFailureToast } from "@raycast/utils";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

export async function changeVolume(volume: number) {
  const spotifyClient = getSpotifyClient();

  try {
    await spotifyClient.putMePlayerVolume(volume);
  } catch (err) {
    await showFailureToast(err, {
      title: "Failed to change volume",
    });
    throw err;
  }
}
