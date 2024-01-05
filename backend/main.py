from fastapi import FastAPI
import numpy as np

import utils.spotify_util as spotify

app = FastAPI()

@app.get("/")
async def root():
    return {
        "message": "Spotify playlist based graph recomendation",
        "routes" : {
            "/search/{search_query}": "Search for most popular songs in user made playlists, based on search query",
        }
    }

@app.get("/playlists/{search_query}")
async def playlists(search_query: str):
    playlists = spotify.get_playlist_from_search(search_query, limit=10)
    tracks = [spotify.get_tracks_from_playlist(playlist) for playlist in playlists]
    
    all_tracks = [track for subtrack in tracks for track in subtrack]
    unique_tracks = set(all_tracks)

    track_dict = {track: i for i, track in enumerate(unique_tracks)}
    edge_graph = np.zeros((len(unique_tracks), len(unique_tracks)))
    track_freq = {track: 0 for track in unique_tracks}

    for track_list in tracks:
        for track in track_list:
            track_freq[track] += 1
            for other_track in track_list:
                if track != other_track:
                    edge_graph[
                        track_dict[track],
                        track_dict[other_track]
                    ] += 1

    most_freq = sorted(track_freq.items(), key=lambda x: x[1], reverse=True)
    top_10 = most_freq[:10]
    top_10_names = [spotify.get_song_features(track[0])["name"] for track in top_10]\

    similarity = []
    for track_id, _ in top_10:
        similarity.append(
            sorted(
                [(other_track, edge_graph[track_dict[track_id], track_dict[other_track]]) for other_track in unique_tracks],
                key=lambda x: x[1],
                reverse=True
            )[:10]
        )

    return {
        "top 10 songs": top_10_names,
        "similarity": similarity
    }
    


