'use client'

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import SearchBar from "@/components/search"
import { Button } from "@/components/ui/button"
import type { 
    trackData,
    similarityGraphNode,
    similarityGraphEdge,
} from '@/lib/types/spotify'

const NetworkGraph = dynamic(() => import("@/components/graph"), { ssr: false });

const MainPage = () => {
    const [input, setInput] = useState<string>("");
    const [searchDepth, setSearchDepth] = useState<number>(10);
    const [onSearch, setOnSearch] = useState<boolean>(false);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [tracks, setTracks] = useState<trackData[]>([]);
    const [nodes, setNodes] = useState<similarityGraphNode[]>([]);
    const [edges, setEdges] = useState<similarityGraphEdge[]>([]);
    // const [collapsedNodes, setCollapsedNodes] = useState<string[]>([]);

    const [viewNodes, setViewNodes] = useState<similarityGraphNode[]>([]);
    const [viewEdges, setViewEdges] = useState<similarityGraphEdge[]>([]);
    // const [viewCollapsed, setViewCollapsed] = useState<string[]>([]);

    useEffect(() => {
        if (!selectedTrack) return;
        const node = nodes.filter((node: similarityGraphNode) => node.id === selectedTrack)[0];
        // get all nodes that are connected to the selected node
        const connectedNodeIds = edges.filter((edge: similarityGraphEdge) => 
                                edge.source === node.id).map((edge: similarityGraphEdge) => 
                                 edge.target);
        const connectedNodes = nodes.filter((node: similarityGraphNode) => connectedNodeIds.includes(node.id));
        const newViewNodes = [node, ...connectedNodes];
        // get all edges where source is the selected node
        const nodeEdges = edges.filter((edge: similarityGraphEdge) => 
                                edge.source === node.id);
        const connectedEdges = edges.filter((edge: similarityGraphEdge) =>
                                connectedNodeIds.includes(edge.source) && edge.target === node.id);
        const newViewEdges = [...nodeEdges, ...connectedEdges];

        const filteredViewNodes = newViewNodes.filter((node: similarityGraphNode) => 
                                    !viewNodes.map((node: similarityGraphNode) => node.id).includes(node.id));
        const filteredViewEdges = newViewEdges.filter((edge: similarityGraphEdge) =>
                                    !viewEdges.map((edge: similarityGraphEdge) => edge.id).includes(edge.id));
        setViewNodes([...viewNodes, ...filteredViewNodes]);
        setViewEdges([...viewEdges, ...filteredViewEdges]);
        setSelectedTrack(null);
    }, [setViewNodes, setViewEdges, selectedTrack, setSelectedTrack, nodes, edges])

    useEffect(() => {
        if (!onSearch) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/search/${input}?searchDepth=${searchDepth}`);
                if (res) {
                    const data = await res.json();
                    setTracks(data.track_data);
                    setNodes(data.graph_data.nodes);
                    setEdges(data.graph_data.edges);
                    setViewNodes([]);
                    setViewEdges([]);
                    // all but data.graph_data.nodes[0]
                    // setCollapsedNodes(data.graph_data.nodes.slice(1).map((node: similarityGraphNode) => node.id));
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setOnSearch(false);
            }
        };

        fetchData();
    }, [onSearch, input, setLoading, setOnSearch, setTracks, setNodes, setEdges]);

    return (
        <div className="w-full h-full flex overflow-hidden relative">
            {viewNodes && 
                <div style={{position: "fixed", width: "100%", height: "100%"}}>
                    <NetworkGraph 
                        nodes={viewNodes}
                        edges={viewEdges}
                        setNodes={setViewNodes}
                        // doubleClickFn={onNodeDoubleClick}
                    />
                    <Button
                        className="bg-orange-300 text-black text-lg rounded-md hover:bg-orange-200 transition-colors duration-200 ease-in-out mr-3"
                        style={{
                            zIndex: 9,
                            position: 'absolute',
                            top: 15,
                            right: 15
                        }}
                        onClick={() => {
                            setViewNodes([]);
                            setViewEdges([]);
                        }}
                    >
                        Reset Graph
                    </Button>
                </div>
                
            }    
            <SearchBar 
                input={input}
                setInput={setInput}
                searchDepth={searchDepth}
                setSearchDepth={setSearchDepth}
                setOnSearch={setOnSearch}
                setSelectedTrack={setSelectedTrack}
                loading={loading}
                tracks={tracks}
            />
        </div>
    )
};  

export default MainPage;