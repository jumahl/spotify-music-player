# Spotify Player for Raycast (Windows)

Raycast extension to control Spotify on Windows using the Spotify Web API.

## 🎵 Features

This extension allows you to control Spotify directly from Raycast on Windows:

- **Search**: Search for songs, artists, albums, and playlists
- **Now Playing**: View detailed information about the current song with album artwork
- **Quick Actions**: Quick playback controls (Play/Pause, Like/Dislike, Next, Previous, Volume, Copy URL)

## 📋 Requirements

- **Spotify Premium**: You need a Premium subscription to control playback
- **Raycast for Windows**: Raycast beta for Windows
- **Active Spotify device**: The Spotify app (desktop, mobile, or web) must be playing music

## 🚀 Installation

### Local Development

1. Clone or download this repository
2. Open the directory in terminal
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development mode:
   ```bash
   npm run dev
   ```
5. Raycast will open automatically and detect the extension

### First Setup

1. The first time you use any command, you'll be asked to authenticate with Spotify
2. Click "Authorize" and follow the instructions in your browser
3. Accept the requested permissions
4. Done! You can now use all commands

## 🎮 Available Commands

### Search

Search for songs, artists, albums, and playlists on Spotify:

- **Filter by category**: Use the dropdown to filter by All, Artists, Songs, Albums, or Playlists
- **Real-time results**: Search updates as you type
- **Detailed information**: View popularity, followers, release dates, etc.
- **Actions**: Play songs, open in Spotify

**Features:**

- Unified search across Spotify's entire catalog
- Shows up to 3-4 results per category in "All" view
- Unlimited results when filtering by a specific category

### Now Playing

Shows detailed information about what's currently playing:

- Album artwork
- Song name
- Artist
- Album
- Duration
- **Auto-refresh**: Information updates every 5 seconds automatically
- Quick actions (Play/Pause, Next, Previous, Refresh, Open in Spotify)

**Keyboard shortcuts:**

- `Enter`: Play/Pause
- `Ctrl + →`: Next song
- `Ctrl + ←`: Previous song
- `Ctrl + R`: Refresh information
- `Ctrl + O`: Open in Spotify

### Quick Actions

List of quick actions to control playback:

- **Play/Pause**: Pause or resume playback
- **Like**: Add current song to "Liked Songs" ❤️
- **Dislike**: Remove song from "Liked Songs" 💔
- **Next**: Skip to next song (Ctrl + →)
- **Previous**: Go back to previous song (Ctrl + ←)
- **Copy Track URL**: Copy Spotify link to clipboard (Ctrl + C)
- **Volume Mute**: Mute (0%)
- **Volume Low**: Low volume (33%)
- **Volume Medium**: Medium volume (66%)
- **Volume High**: High volume (100%)
- **Volume Up**: Increase volume (Ctrl + ↑)
- **Volume Down**: Decrease volume (Ctrl + ↓)

**Preferences:**

- **Volume Step**: Configure volume increment (5%, 10%, 15%, or 20%)

## ⚙️ Preferences

The extension includes the following configurable preferences:

- **Show Album Art**: Show or hide album artwork in Now Playing
- **Volume Step**: Volume amount to increase/decrease (5%, 10%, 15%, 20%)

## 🛠️ Development

### Project Structure

```
spotify-music-player/
├── src/
│   ├── api/                    # Spotify API functions
│   │   ├── oauth.ts            # OAuth configuration
│   │   ├── getCurrentlyPlaying.ts
│   │   ├── getPlaybackState.ts
│   │   ├── search.ts
│   │   ├── play.ts
│   │   ├── pause.ts
│   │   ├── addToMySavedTracks.ts
│   │   ├── removeFromMySavedTracks.ts
│   │   └── ...
│   ├── helpers/                # Utilities
│   │   ├── spotify.api.ts      # Generated API client
│   │   ├── withSpotifyClient.tsx
│   │   └── getError.ts
│   ├── hooks/                  # React hooks
│   │   ├── useCurrentlyPlaying.ts
│   │   ├── usePlaybackState.ts
│   │   └── useSearch.ts
│   ├── components/             # React components
│   │   ├── View.tsx
│   │   └── TrackListItem.tsx
│   ├── search.tsx              # Search command
│   ├── nowPlaying.tsx          # Now Playing command
│   └── quickActions.tsx        # Quick Actions command
├── assets/
│   └── spotify-icon.svg
└── package.json
```

## 🔧 Technical Architecture

This extension uses the **Spotify Web API** instead of AppleScript (which only works on Mac). This means:

✅ **Works on Windows** (and would also work on Linux if Raycast supports it)  
✅ **Not dependent on desktop app** - Can control any Spotify device  
✅ **More features available** - Full access to Spotify API  
✅ **More reliable** - Doesn't depend on OS scripting

### Implemented Improvements

🎯 **Better error handling**: User-friendly error messages  
🔄 **Auto-refresh**: Now Playing updates every 5 seconds  
⌨️ **Windows shortcuts**: All shortcuts use Ctrl instead of Cmd  
🎨 **Emoji messages**: Enhanced visual feedback with emojis  
⚙️ **Configurable preferences**: Customize volume step and display

### Authentication

Uses OAuth 2.0 with PKCE (Proof Key for Code Exchange) for secure authentication without storing client secrets.

### Permissions (Scopes)

The extension requests the following permissions:

- `playlist-modify-private` - Modify private playlists
- `playlist-modify-public` - Modify public playlists
- `playlist-read-collaborative` - Read collaborative playlists
- `playlist-read-private` - Read private playlists
- `user-follow-read` - Read followed artists
- `user-library-modify` - Modify library (Liked Songs)
- `user-library-read` - Read library
- `user-modify-playback-state` - Control playback
- `user-read-currently-playing` - View current song
- `user-read-playback-state` - View playback state
- `user-read-private` - Read private profile
- `user-top-read` - Read top artists/songs

## ⚠️ Limitations

- **Requires Spotify Premium**: Playback control is only available for Premium users
- **Active device required**: A Spotify device must be playing music (can be mobile, desktop, or web)
- **Rate limiting**: Spotify API has limits on requests per second

## 🐛 Troubleshooting

### "No active device"

- Make sure Spotify is playing music on any device
- Open the Spotify app (desktop, mobile, or web) and play something

### "Nothing is currently playing"

- Start playback on Spotify first
- Use the "Now Playing" command to verify

### Authentication errors

- Revoke access in your [Spotify settings](https://www.spotify.com/account/apps/)
- Run any command again to re-authenticate

### Extension doesn't appear in Raycast

- Make sure you're in development mode: `npm run dev`
- Verify that Raycast is updated
- Check Raycast logs for errors

## 📝 License

MIT

## 🙏 Credits

Based on the original [Spotify Player](https://github.com/raycast/extensions/tree/main/extensions/spotify-player) extension from the Raycast repository, adapted to work on Windows using the Spotify Web API.
