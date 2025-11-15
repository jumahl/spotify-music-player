import { ActionPanel, List, Action, Icon, showToast, Toast, getPreferenceValues, Clipboard } from "@raycast/api";
import { View } from "./components/View";
import { usePlaybackState } from "./hooks/usePlaybackState";
import { useCurrentlyPlaying } from "./hooks/useCurrentlyPlaying";
import { play } from "./api/play";
import { pause } from "./api/pause";
import { skipToNext } from "./api/skipToNext";
import { skipToPrevious } from "./api/skipToPrevious";
import { changeVolume } from "./api/changeVolume";
import { addToMySavedTracks } from "./api/addToMySavedTracks";
import { removeFromMySavedTracks } from "./api/removeFromMySavedTracks";
import { toggleShuffle } from "./api/toggleShuffle";
import { toggleRepeat } from "./api/toggleRepeat";
import { startRadio } from "./api/startRadio";
import { TrackObject } from "./helpers/spotify.api";
import { getUserFriendlyErrorMessage } from "./helpers/getError";

interface Preferences {
  volumeStep: string;
}

function QuickActionsCommand() {
  const { playbackStateData, playbackStateRevalidate } = usePlaybackState();
  const { currentlyPlayingData, currentlyPlayingRevalidate } = useCurrentlyPlaying();
  const preferences = getPreferenceValues<Preferences>();

  const isPlaying = playbackStateData?.is_playing;
  const currentVolume = playbackStateData?.device?.volume_percent ?? 50;
  const isTrack = currentlyPlayingData?.data?.currently_playing_type !== "episode";
  const trackId = isTrack ? (currentlyPlayingData?.item as TrackObject)?.id : undefined;
  const trackUri = isTrack ? (currentlyPlayingData?.item as TrackObject)?.uri : undefined;
  const shuffleState = playbackStateData?.shuffle_state ?? false;
  const repeatState = playbackStateData?.repeat_state ?? "off";
  const volumeStep = parseInt(preferences.volumeStep || "10", 10);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await pause();
        await showToast({ style: Toast.Style.Success, title: "⏸ Paused" });
      } else {
        await play();
        await showToast({ style: Toast.Style.Success, title: "▶️ Playing" });
      }
      await playbackStateRevalidate();
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleNext = async () => {
    try {
      await skipToNext();
      await currentlyPlayingRevalidate();
      await showToast({ style: Toast.Style.Success, title: "⏭ Next track" });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handlePrevious = async () => {
    try {
      await skipToPrevious();
      await currentlyPlayingRevalidate();
      await showToast({ style: Toast.Style.Success, title: "⏮ Previous track" });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleVolumeChange = async (newVolume: number) => {
    try {
      await changeVolume(newVolume);
      await playbackStateRevalidate();
      await showToast({ style: Toast.Style.Success, title: `🔊 Volume: ${newVolume}%` });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleVolumeUp = async () => {
    const newVolume = Math.min(currentVolume + volumeStep, 100);
    await handleVolumeChange(newVolume);
  };

  const handleVolumeDown = async () => {
    const newVolume = Math.max(currentVolume - volumeStep, 0);
    await handleVolumeChange(newVolume);
  };

  const handleLike = async () => {
    if (!trackId) {
      await showToast({ style: Toast.Style.Failure, title: "No track is currently playing" });
      return false;
    }
    try {
      await addToMySavedTracks({ trackIds: [trackId] });
      await showToast({ style: Toast.Style.Success, title: "❤️ Liked" });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleDislike = async () => {
    if (!trackId) {
      await showToast({ style: Toast.Style.Failure, title: "No track is currently playing" });
      return false;
    }
    try {
      await removeFromMySavedTracks({ trackIds: [trackId] });
      await showToast({ style: Toast.Style.Success, title: "💔 Removed from Liked Songs" });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleCopyUrl = async () => {
    if (!currentlyPlayingData || !currentlyPlayingData.item) {
      await showToast({ style: Toast.Style.Failure, title: "Nothing is currently playing" });
      return false;
    }
    const external_urls = currentlyPlayingData.item.external_urls;
    const title = currentlyPlayingData.item.name;

    if (!external_urls?.spotify) {
      await showToast({ style: Toast.Style.Failure, title: "No Spotify URL available" });
      return false;
    }

    try {
      await Clipboard.copy({
        html: `<a href="${external_urls.spotify}">${title}</a>`,
        text: external_urls.spotify,
      });
      await showToast({ style: Toast.Style.Success, title: "📋 URL copied to clipboard" });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleToggleShuffle = async () => {
    try {
      const newState = !shuffleState;
      await toggleShuffle(newState);
      await playbackStateRevalidate();
      await showToast({ style: Toast.Style.Success, title: newState ? "🔀 Shuffle On" : "➡️ Shuffle Off" });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleToggleRepeat = async () => {
    try {
      let newState: "track" | "context" | "off";
      if (repeatState === "off") {
        newState = "context";
      } else if (repeatState === "context") {
        newState = "track";
      } else {
        newState = "off";
      }
      await toggleRepeat(newState);
      await playbackStateRevalidate();
      const message =
        newState === "off" ? "➡️ Repeat Off" : newState === "track" ? "🔂 Repeat Track" : "🔁 Repeat Context";
      await showToast({ style: Toast.Style.Success, title: message });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  const handleStartRadio = async () => {
    if (!trackUri) {
      await showToast({ style: Toast.Style.Failure, title: "No track is currently playing" });
      return false;
    }
    try {
      await startRadio(trackUri);
      await currentlyPlayingRevalidate();
      await showToast({ style: Toast.Style.Success, title: "📻 Started radio" });
    } catch (err) {
      const message = getUserFriendlyErrorMessage(err);
      await showToast({ style: Toast.Style.Failure, title: message });
    }
    return false; // Prevents Raycast from closing
  };

  return (
    <List searchBarPlaceholder="Search for actions...">
      <List.Item
        title={isPlaying ? "Pause" : "Play"}
        subtitle={isPlaying ? "Pause the current track" : "Resume playback"}
        icon={isPlaying ? Icon.Pause : Icon.Play}
        actions={
          <ActionPanel>
            <Action title={isPlaying ? "Pause" : "Play"} onAction={handlePlayPause} />
          </ActionPanel>
        }
      />

      <List.Item
        title="Like"
        subtitle="Like the current track"
        icon={Icon.Heart}
        actions={
          <ActionPanel>
            <Action title="Like Current Track" onAction={handleLike} shortcut={{ modifiers: ["ctrl"], key: "l" }} />
          </ActionPanel>
        }
      />

      <List.Item
        title="Dislike"
        subtitle="Dislike the current track"
        icon={Icon.HeartDisabled}
        actions={
          <ActionPanel>
            <Action
              title="Dislike Current Track"
              onAction={handleDislike}
              shortcut={{ modifiers: ["ctrl", "shift"], key: "l" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Next"
        subtitle="Skip to the next track"
        icon={Icon.Forward}
        actions={
          <ActionPanel>
            <Action title="Next Track" onAction={handleNext} shortcut={{ modifiers: ["ctrl"], key: "arrowRight" }} />
          </ActionPanel>
        }
      />

      <List.Item
        title="Previous"
        subtitle="Skip to the previous track"
        icon={Icon.Rewind}
        actions={
          <ActionPanel>
            <Action
              title="Previous Track"
              onAction={handlePrevious}
              shortcut={{ modifiers: ["ctrl"], key: "arrowLeft" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Copy Track URL"
        subtitle="Copy Spotify URL of current track to clipboard"
        icon={Icon.Link}
        actions={
          <ActionPanel>
            <Action title="Copy URL" onAction={handleCopyUrl} shortcut={{ modifiers: ["ctrl"], key: "c" }} />
          </ActionPanel>
        }
      />

      <List.Item
        title="Toggle Shuffle"
        subtitle={shuffleState ? "Turn shuffle off" : "Turn shuffle on"}
        icon={Icon.Shuffle}
        actions={
          <ActionPanel>
            <Action
              title="Toggle Shuffle"
              onAction={handleToggleShuffle}
              shortcut={{ modifiers: ["ctrl"], key: "s" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Toggle Repeat"
        subtitle={
          repeatState === "off"
            ? "Turn repeat on (context)"
            : repeatState === "context"
              ? "Repeat one track"
              : "Turn repeat off"
        }
        icon={Icon.Repeat}
        actions={
          <ActionPanel>
            <Action title="Toggle Repeat" onAction={handleToggleRepeat} shortcut={{ modifiers: ["ctrl"], key: "r" }} />
          </ActionPanel>
        }
      />

      <List.Item
        title="Start Radio"
        subtitle="Start a radio station based on the current track"
        icon={Icon.Music}
        actions={
          <ActionPanel>
            <Action
              title="Start Radio"
              onAction={handleStartRadio}
              shortcut={{ modifiers: ["ctrl", "shift"], key: "r" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Volume Mute"
        subtitle="Change the volume to 0%"
        icon={Icon.SpeakerOff}
        actions={
          <ActionPanel>
            <Action
              title="Mute Volume"
              onAction={() => handleVolumeChange(0)}
              shortcut={{ modifiers: ["ctrl"], key: "m" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Volume Low"
        subtitle="Change the volume to 33%"
        icon={Icon.SpeakerDown}
        actions={
          <ActionPanel>
            <Action
              title="Set Volume to 33%"
              onAction={() => handleVolumeChange(33)}
              shortcut={{ modifiers: ["ctrl"], key: "1" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Volume Medium"
        subtitle="Change the volume to 66%"
        icon={Icon.Speaker}
        actions={
          <ActionPanel>
            <Action
              title="Set Volume to 66%"
              onAction={() => handleVolumeChange(66)}
              shortcut={{ modifiers: ["ctrl"], key: "2" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Volume High"
        subtitle="Change the volume to 100%"
        icon={Icon.SpeakerOn}
        actions={
          <ActionPanel>
            <Action
              title="Set Volume to 100%"
              onAction={() => handleVolumeChange(100)}
              shortcut={{ modifiers: ["ctrl"], key: "3" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Volume Up"
        subtitle={`Increase the volume by ${volumeStep}%`}
        icon={Icon.Plus}
        actions={
          <ActionPanel>
            <Action
              title="Increase Volume"
              onAction={handleVolumeUp}
              shortcut={{ modifiers: ["ctrl"], key: "arrowUp" }}
            />
          </ActionPanel>
        }
      />

      <List.Item
        title="Volume Down"
        subtitle={`Decrease the volume by ${volumeStep}%`}
        icon={Icon.Minus}
        actions={
          <ActionPanel>
            <Action
              title="Decrease Volume"
              onAction={handleVolumeDown}
              shortcut={{ modifiers: ["ctrl"], key: "arrowDown" }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}

export default function Command() {
  return (
    <View>
      <QuickActionsCommand />
    </View>
  );
}
