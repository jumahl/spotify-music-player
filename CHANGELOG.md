# Changelog

## [Initial Release] - {PR_MERGE_DATE}

- First public release of Spotify Player for Raycast (Windows)
- Search for songs, artists, albums, and playlists
- Now Playing view with auto-refresh
- Quick Actions for playback, volume, like/dislike, and copy track URL
- Windows shortcuts (Ctrl)
- Preferences for album art and volume step
- Improved error handling
- OAuth 2.0 authentication

## [2025.11.15]

- Updated `src/helpers/spotify.api.ts` to version 2025.5.18 using the sonallux specification.
- Adapted all code to the new API response structure.
- Fixed reserved shortcut error in Quick Actions (`Enter`).

## [2025.11.16]

- Fixed shortcuts that were not working on Windows; they now appear correctly in the interface.
- All simple actions now use the `Shift` key as the main modifier.
- Action subtitles in Quick Actions are now static to prevent React state update errors.
