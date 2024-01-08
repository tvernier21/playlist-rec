import { NextResponse } from 'next/server'
import type { 
    tracksDataMap,
    similarityGraphNode,
    similarityGraphEdge,
} from '@/lib/types/spotify'

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

    // create nodes and edges
    let nodes: similarityGraphNode[] = [];
    let edges: similarityGraphEdge[] = [];
    for (const track_id of track_ids) {
        nodes.push({
            id: track_id,
            label: track_data[track_id]["title"],
        });

        let top_edges: similarityGraphEdge[] = [];
        track_ids.forEach((sim_track_id: string) => {
            const tmp = similarity_graph[track_dict[track_id]][track_dict[sim_track_id]];
            top_edges.push({
                source: track_id,
                target: sim_track_id,
                id: track_id + sim_track_id,
                label: tmp.toString(),
            });
        });
        // sort descending
        top_edges.sort((a, b) => {
            return parseFloat(b.label) - parseFloat(a.label);
        });
        top_edges = top_edges.slice(0, 10);
        top_edges.forEach((edge) => {
            edges.push(edge);
        });
    }

    return NextResponse.json({
        "graph_data": {
            "nodes": nodes,
            "edges": edges,
        },
        "track_data": track_data,
    }); 
}