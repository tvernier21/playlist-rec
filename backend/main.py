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

    return {
        "track_freq": playlists,
        "similarity_graph": tracks,
        "track_dict": track_dict,
    }

@app.get("/track/{song_id}")
async def track_data(song_id: str):
    track = spotify.get_tracks_from_playlist(song_id)
    return {
        "title": track["name"],
        "artist": track["artists"][0]["name"],
        "preview_url": track["preview_url"]
    }

