export interface trackData {
    id: string;
    title: string;
    artist: string;
    preview_url: string;
    frequency: number;
    map_idx: number;
}

export interface similarityGraphNode {
    id: string;
    label: string;
}

export interface similarityGraphEdge {
    source: string;
    target: string;
    id: string;
    label: string;
}