import { showHUD } from "@raycast/api";
import { setSpotifyClient } from "./helpers/withSpotifyClient";
import { getCurrentlyPlaying } from "./api/getCurrentlyPlaying";
import { addToMySavedTracks } from "./api/addToMySavedTracks";
import { TrackObject } from "./helpers/spotify.api";

export default async function Command() {
  await setSpotifyClient();

  const currentlyPlayingData = await getCurrentlyPlaying();
  const nothingIsPlaying = !currentlyPlayingData || !currentlyPlayingData?.item;

  if (nothingIsPlaying) {
    return await showHUD("Nothing is currently playing");
  }

  const isTrack = currentlyPlayingData?.currently_playing_type !== "episode";

  if (!isTrack) {
    return await showHUD("Liking episodes is not supported yet");
  }

  const trackId = (currentlyPlayingData.item as TrackObject).id;

  if (!trackId) {
    return await showHUD("Could not get track ID");
  }

  try {
    await addToMySavedTracks({ trackIds: [trackId] });
    await showHUD("Liked");
  } catch (error) {
    await showHUD("Failed to like track");
  }
}
