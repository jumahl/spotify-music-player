import { showHUD } from "@raycast/api";
import { setSpotifyClient } from "./helpers/withSpotifyClient";
import { skipToPrevious } from "./api/skipToPrevious";
import { getErrorMessage } from "./helpers/getError";

export default async function Command() {
  await setSpotifyClient();

  try {
    await skipToPrevious();
    await showHUD("Skipped to previous");
  } catch (err) {
    const error = getErrorMessage(err);
    await showHUD(error);
  }
}
