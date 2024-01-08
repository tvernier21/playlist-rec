export interface trackDataType {
    title: string;
    artist: string;
    preview_url: string;
    frequency: number;
    map_idx: number;
}

export interface tracksDataMap {
    [track_id: string]: trackDataType;
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