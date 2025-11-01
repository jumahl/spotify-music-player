import { useCachedPromise } from "@raycast/utils";
import { getPlaybackState } from "../api/getPlaybackState";

export function usePlaybackState() {
  const { data, error, isLoading, revalidate } = useCachedPromise(() => getPlaybackState());

  return {
    playbackStateData: data,
    playbackStateError: error,
    playbackStateIsLoading: isLoading,
    playbackStateRevalidate: revalidate,
  };
}
