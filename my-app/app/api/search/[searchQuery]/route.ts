import { NextResponse } from 'next/server'
import type { tracksDataMap } from '@/lib/types/spotify'

interface contextType {
    params: {
        searchQuery: string;
    }
}

export async function GET(request: Request, context: contextType) {
    const { searchQuery } = context.params;
    const res = await fetch(`http://127.0.0.1:8000/playlists/${searchQuery}`);
    if (!res.ok) {
        return NextResponse.error();
    }
    const data = await res.json();

    const track_dict = data["track_dict"];
    const track_freq = data["track_freq"];
    const similarity_graph = data["similarity_graph"];

    //track data is of type string -> song data
    let track_data: tracksDataMap = {};
    const track_ids = Object.keys(track_dict);
    const n_tracks = track_ids.length;
    for (let i = 0; i < n_tracks; i += 50) {
        const track_ids_string = track_ids.slice(i, i + 50).join(",");
        const res = await fetch(`http://127.0.0.1:8000/tracks/${track_ids_string}`);
        if (!res.ok) {
            return NextResponse.error();
        }
        const { tracks } = await res.json();
        for (const track of tracks) {
            track_data[track["id"]] = {
                title: track["title"],
                artist: track["artist"],
                preview_url: track["preview_url"],
                frequency: track_freq[track["id"]],
                map_idx: track_dict[track["id"]],
            };
        }
    }

    return NextResponse.json({
        "similarity_graph": similarity_graph,
        "track_data": track_data,
    }); 
}