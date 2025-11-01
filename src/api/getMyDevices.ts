import { showFailureToast } from "@raycast/utils";
import { getSpotifyClient } from "../helpers/withSpotifyClient";

export async function getMyDevices() {
  const spotifyClient = getSpotifyClient();

  try {
    const response = await spotifyClient.getMePlayerDevices();
    return response;
  } catch (err) {
    await showFailureToast(err, {
      title: "Failed to get devices",
    });
    throw err;
  }
}
