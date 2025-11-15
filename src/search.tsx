import { useState } from "react";
import { List, Icon, ActionPanel, Action, showHUD } from "@raycast/api";
import { View } from "./components/View";
import { useSearch } from "./hooks/useSearch";
import TrackListItem from "./components/TrackListItem";
import { play } from "./api/play";
import type { ArtistObject, SimplifiedAlbumObject, TrackObject, SimplifiedPlaylistObject } from "./helpers/spotify.api";

type FilterValue = "all" | "artists" | "tracks" | "albums" | "playlists";

const filters: Record<FilterValue, string> = {
  all: "All",
  artists: "Artists",
  tracks: "Songs",
  albums: "Albums",
  playlists: "Playlists",
};

function SearchCommand() {
  const [searchText, setSearchText] = useState("");
  const [searchFilter, setSearchFilter] = useState<FilterValue>("all");

  const { searchData, searchIsLoading } = useSearch({
    query: searchText,
    options: { keepPreviousData: true },
  });

  const showAll = searchFilter === "all";

  return (
    <List
      searchBarPlaceholder="Search for songs, artists, albums, or playlists..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      isLoading={searchIsLoading}
      throttle
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter search"
          value={searchFilter}
          onChange={(newValue) => setSearchFilter(newValue as FilterValue)}
        >
          {Object.entries(filters).map(([value, label]) => (
            <List.Dropdown.Item key={value} title={label} value={value} />
          ))}
        </List.Dropdown>
      }
    >
      {!searchText ? (
        <List.EmptyView title="What do you want to listen to?" icon={Icon.Music} />
      ) : (
        <>
          {/* Artists Section */}
          {(showAll || searchFilter === "artists") &&
            searchData?.artists?.items &&
            searchData.artists.items.length > 0 && (
              <List.Section
                title="Artists"
                subtitle={showAll ? `${Math.min(3, searchData.artists.items.length)}` : undefined}
              >
                {searchData.artists.items.slice(0, showAll ? 3 : undefined).map((artist) => {
                  if (!artist) return null;
                  const typedArtist = artist as ArtistObject;
                  return (
                    <List.Item
                      key={typedArtist.id}
                      title={typedArtist.name || "Unknown Artist"}
                      subtitle={`${typedArtist.followers?.total?.toLocaleString() || 0} followers`}
                      icon={{ source: typedArtist.images?.[0]?.url || Icon.Person }}
                      accessories={[{ text: `${typedArtist.popularity}%`, tooltip: "Popularity" }]}
                      actions={
                        <ActionPanel>
                          {typedArtist.external_urls?.spotify && (
                            <Action.OpenInBrowser title="Open in Spotify" url={typedArtist.external_urls.spotify} />
                          )}
                          {typedArtist.external_urls?.spotify && (
                            <Action.CopyToClipboard
                              title="Copy Spotify URL"
                              content={typedArtist.external_urls.spotify}
                            />
                          )}
                        </ActionPanel>
                      }
                    />
                  );
                })}
              </List.Section>
            )}
          {/* Tracks Section */}
          {(showAll || searchFilter === "tracks") &&
            searchData?.tracks?.items &&
            searchData.tracks.items.length > 0 && (
              <List.Section
                title="Songs"
                subtitle={showAll ? `${Math.min(4, searchData.tracks.items.length)}` : undefined}
              >
                {searchData.tracks.items.slice(0, showAll ? 4 : undefined).map((track) => {
                  if (!track) return null;
                  const typedTrack = track as TrackObject;
                  return <TrackListItem key={typedTrack.id} track={typedTrack} album={typedTrack.album} />;
                })}
              </List.Section>
            )}
          {/* Albums Section */}
          {(showAll || searchFilter === "albums") &&
            searchData?.albums?.items &&
            searchData.albums.items.length > 0 && (
              <List.Section
                title="Albums"
                subtitle={showAll ? `${Math.min(3, searchData.albums.items.length)}` : undefined}
              >
                {searchData.albums.items.slice(0, showAll ? 3 : undefined).map((album) => {
                  if (!album) return null;
                  const typedAlbum = album as SimplifiedAlbumObject;
                  return (
                    <List.Item
                      key={typedAlbum.id}
                      title={typedAlbum.name || "Unknown Album"}
                      subtitle={typedAlbum.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
                      icon={{ source: typedAlbum.images?.[0]?.url || Icon.Cd }}
                      accessories={[
                        { text: typedAlbum.release_date || "" },
                        { text: `${typedAlbum.total_tracks} tracks`, tooltip: "Total Tracks" },
                      ]}
                      actions={
                        <ActionPanel>
                          <Action
                            title="Play Album"
                            icon={Icon.Play}
                            onAction={async () => {
                              try {
                                await play({ contextUri: typedAlbum.uri });
                                await showHUD("▶️ Playing Album");
                              } catch {
                                await showHUD("❌ Could not play album");
                              }
                              return false; // Prevents Raycast from closing
                            }}
                          />
                          {typedAlbum.external_urls?.spotify && (
                            <Action.OpenInBrowser title="Open in Spotify" url={typedAlbum.external_urls.spotify} />
                          )}
                          {typedAlbum.external_urls?.spotify && (
                            <Action.CopyToClipboard
                              title="Copy Spotify URL"
                              content={typedAlbum.external_urls.spotify}
                            />
                          )}
                        </ActionPanel>
                      }
                    />
                  );
                })}
              </List.Section>
            )}
          {/* Playlists Section */}
          {(showAll || searchFilter === "playlists") &&
            searchData?.playlists?.items &&
            searchData.playlists.items.length > 0 && (
              <List.Section
                title="Playlists"
                subtitle={showAll ? `${Math.min(3, searchData.playlists.items.length)}` : undefined}
              >
                {searchData.playlists.items.slice(0, showAll ? 3 : undefined).map((playlist) => {
                  if (!playlist) return null;
                  const typedPlaylist = playlist as SimplifiedPlaylistObject;
                  return (
                    <List.Item
                      key={typedPlaylist.id}
                      title={typedPlaylist.name || "Unknown Playlist"}
                      subtitle={`by ${typedPlaylist.owner?.display_name || "Unknown"}`}
                      icon={{ source: typedPlaylist.images?.[0]?.url || Icon.List }}
                      accessories={[{ text: `${typedPlaylist.tracks?.total || 0} tracks`, tooltip: "Total Tracks" }]}
                      actions={
                        <ActionPanel>
                          <Action
                            title="Play Playlist"
                            icon={Icon.Play}
                            onAction={async () => {
                              try {
                                await play({ contextUri: typedPlaylist.uri });
                                await showHUD("▶️ Playing Playlist");
                              } catch {
                                await showHUD("❌ Could not play playlist");
                              }
                              return false; // Prevents Raycast from closing
                            }}
                          />
                          {typedPlaylist.external_urls?.spotify && (
                            <Action.OpenInBrowser title="Open in Spotify" url={typedPlaylist.external_urls.spotify} />
                          )}
                          {typedPlaylist.external_urls?.spotify && (
                            <Action.CopyToClipboard
                              title="Copy Spotify URL"
                              content={typedPlaylist.external_urls.spotify}
                            />
                          )}
                        </ActionPanel>
                      }
                    />
                  );
                })}
              </List.Section>
            )}
          {searchText &&
            !searchIsLoading &&
            !searchData?.tracks?.items?.length &&
            !searchData?.artists?.items?.length &&
            !searchData?.albums?.items?.length &&
            !searchData?.playlists?.items?.length && (
              <List.EmptyView
                title="No results found"
                description={`Try searching for something else`}
                icon={Icon.MagnifyingGlass}
              />
            )}
        </>
      )}
    </List>
  );
}

export default function Command() {
  return (
    <View>
      <SearchCommand />
    </View>
  );
}
