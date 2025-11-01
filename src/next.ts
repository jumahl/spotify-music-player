import { showHUD } from "@raycast/api";
import { setSpotifyClient } from "./helpers/withSpotifyClient";
import { skipToNext } from "./api/skipToNext";
import { getErrorMessage } from "./helpers/getError";

export default async function Command() {
  await setSpotifyClient();

  try {
    await skipToNext();
    await showHUD("Skipped to next");
  } catch (err) {
    const error = getErrorMessage(err);
    await showHUD(error);
  }
}
