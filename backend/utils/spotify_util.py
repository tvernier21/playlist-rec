import requests
import os
from dotenv import load_dotenv
import pandas as pd

SPOTIFY_URL = "https://api.spotify.com/v1/"

def get_client_credentials():
    load_dotenv()
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    return client_id, client_secret

def get_api_headers():
    client_id, client_secret = get_client_credentials()

    url = "https://accounts.spotify.com/api/token"
    auth_response = requests.post(url, {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    })
    auth_response_json = auth_response.json()
    access_token = auth_response_json["access_token"]
    headers = {
        "Authorization": "Bearer {token}".format(token=access_token) 
    }
    return headers

def get_playlist_from_search(search_query, limit=6):
    res = requests.get(SPOTIFY_URL + "search",
                       headers=get_api_headers(),
                       params={
                           "query": search_query,
                           "type": "playlist",
                           "limit": limit,
                       }).json()
    if "error" in res:
        raise Exception(res["error"]["message"])
        return None
    playlists = [item["id"] for item in res["playlists"]["items"]]
    return playlists

def get_tracks_from_playlist(playlist_id):
    res = requests.get(SPOTIFY_URL + f"playlists/{playlist_id}/tracks",
                       headers=get_api_headers()).json()
    if "error" in res:
        raise Exception(res["error"]["message"])
        return None

    tracks = []
    for item in res["items"]:
        if item["is_local"]:
            continue
        try:
            tracks.append(item["track"]["id"])
        except:
            continue

    n = res["total"]
    for i in range(1, n // 100 + 1):
        res = requests.get(SPOTIFY_URL + f"playlists/{playlist_id}/tracks",
                           headers=get_api_headers(),
                           params={
                               "offset": i * 100,
                           }).json()
        if "error" in res:
            raise Exception(res["error"]["message"])
            return None

        for item in res["items"]:
            if item["is_local"]:
                continue
            try:
                tracks.append(item["track"]["id"])
            except:
                continue
    return tracks

def get_song_features(track_id):
    res = requests.get(SPOTIFY_URL + f"tracks/{track_id}",
                       headers=get_api_headers()).json()
    if "error" in res:
        raise Exception(res["error"]["message"])
        return None
    return res

def get_songs_features(track_ids_str):
    res = requests.get(SPOTIFY_URL + f"tracks",
                       headers=get_api_headers(),
                       params={
                           "ids": track_ids_str,
                       }).json()
    if "error" in res:
        raise Exception(res["error"]["message"])
        return None
    return res



