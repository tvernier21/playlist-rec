import numpy as np
import spotify_util as spotify

search = "thugger"

print("Getting songs from playlists...")
playlists = spotify.get_playlist_from_search(search, limit=10)
tracks = [spotify.get_tracks_from_playlist(playlist) for playlist in playlists]


all_tracks = [track for subtrack in tracks for track in subtrack]
unique_tracks = set(all_tracks)
print(f"Found {len(unique_tracks)} unique tracks")

# Create a dictionary of track ids to indices
track_dict = {track: i for i, track in enumerate(unique_tracks)}
# Create a nxn graph representation of edges between tracks
edge_graph = np.zeros((len(unique_tracks), len(unique_tracks)))
# Create a track frequency dictionary
track_freq = {track: 0 for track in unique_tracks}

print("Calculating edges...")
# For each track, get every other track in the playlist and increment the edge
for track_list in tracks:
    for track in track_list:
        track_freq[track] += 1
        for other_track in track_list:
            if track != other_track:
                edge_graph[
                    track_dict[track],
                    track_dict[other_track]
                ] += 1

# Get the most frequent tracks
most_freq = sorted(track_freq.items(), key=lambda x: x[1], reverse=True)
top_10 = most_freq[:10]
top_10_names = [spotify.get_song_features(track[0])["name"] for track in top_10]

print("Calculating similarity...")
# of the top 10, determine each of those top 10 most similar
similarity = []
for track_id, _ in top_10:
    similarity.append(
        sorted(
            [(other_track, edge_graph[track_dict[track_id], track_dict[other_track]]) for other_track in unique_tracks],
            key=lambda x: x[1],
            reverse=True
        )[:10]
    )
# Print the results
for i, track in enumerate(top_10_names):
    print(f"Track: {track}")
    for j, (track_id, w) in enumerate(similarity[i]):
        print(f"\t{j+1}. {spotify.get_song_features(track_id)['name']} ({w})")
    print()



