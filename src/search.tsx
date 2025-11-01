import { useState } from "react";
import { List, Icon, ActionPanel, Action, showHUD } from "@raycast/api";
import { View } from "./components/View";
import { useSearch } from "./hooks/useSearch";
import TrackListItem from "./components/TrackListItem";
import { play } from "./api/play";

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
                {searchData.artists.items
                  .slice(0, showAll ? 3 : undefined)
                  .filter(Boolean)
                  .map((artist) => {
                    if (!artist) return null;
                    return (
                      <List.Item
                        key={artist.id}
                        title={artist.name || "Unknown Artist"}
                        subtitle={`${artist.followers?.total?.toLocaleString() || 0} followers`}
                        icon={{ source: artist.images?.[0]?.url || Icon.Person }}
                        accessories={[{ text: `${artist.popularity}%`, tooltip: "Popularity" }]}
                        actions={
                          <ActionPanel>
                            {artist.external_urls?.spotify && (
                              <Action.OpenInBrowser title="Open in Spotify" url={artist.external_urls.spotify} />
                            )}
                            {artist.external_urls?.spotify && (
                              <Action.CopyToClipboard title="Copy Spotify URL" content={artist.external_urls.spotify} />
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
                {searchData.tracks.items
                  .slice(0, showAll ? 4 : undefined)
                  .filter(Boolean)
                  .map((track) => {
                    if (!track) return null;
                    return <TrackListItem key={track.id} track={track} album={track.album} />;
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
                {searchData.albums.items
                  .slice(0, showAll ? 3 : undefined)
                  .filter(Boolean)
                  .map((album) => {
                    if (!album) return null;
                    return (
                      <List.Item
                        key={album.id}
                        title={album.name || "Unknown Album"}
                        subtitle={album.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
                        icon={{ source: album.images?.[0]?.url || Icon.Cd }}
                        accessories={[
                          { text: album.release_date || "" },
                          { text: `${album.total_tracks} tracks`, tooltip: "Total Tracks" },
                        ]}
                        actions={
                          <ActionPanel>
                            <Action
                              title="Play Album"
                              icon={Icon.Play}
                              onAction={async () => {
                                try {
                                  await play({ contextUri: album.uri });
                                  await showHUD("▶️ Playing Album");
                                } catch (error) {
                                  await showHUD("❌ Could not play album");
                                }
                              }}
                            />
                            {album.external_urls?.spotify && (
                              <Action.OpenInBrowser title="Open in Spotify" url={album.external_urls.spotify} />
                            )}
                            {album.external_urls?.spotify && (
                              <Action.CopyToClipboard title="Copy Spotify URL" content={album.external_urls.spotify} />
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
                {searchData.playlists.items
                  .slice(0, showAll ? 3 : undefined)
                  .filter(Boolean)
                  .map((playlist) => {
                    if (!playlist) return null;
                    return (
                      <List.Item
                        key={playlist.id}
                        title={playlist.name || "Unknown Playlist"}
                        subtitle={`by ${playlist.owner?.display_name || "Unknown"}`}
                        icon={{ source: playlist.images?.[0]?.url || Icon.List }}
                        accessories={[{ text: `${playlist.tracks?.total || 0} tracks`, tooltip: "Total Tracks" }]}
                        actions={
                          <ActionPanel>
                            <Action
                              title="Play Playlist"
                              icon={Icon.Play}
                              onAction={async () => {
                                try {
                                  await play({ contextUri: playlist.uri });
                                  await showHUD("▶️ Playing Playlist");
                                } catch (error) {
                                  await showHUD("❌ Could not play playlist");
                                }
                              }}
                            />
                            {playlist.external_urls?.spotify && (
                              <Action.OpenInBrowser title="Open in Spotify" url={playlist.external_urls.spotify} />
                            )}
                            {playlist.external_urls?.spotify && (
                              <Action.CopyToClipboard
                                title="Copy Spotify URL"
                                content={playlist.external_urls.spotify}
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
