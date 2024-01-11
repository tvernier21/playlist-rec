'use client'

import { useState, useRef } from "react"
import { GraphCanvas, GraphCanvasRef, useSelection} from 'reagraph'
import { Button } from "@/components/ui/button"
import type {
    similarityGraphNode,
    similarityGraphEdge,
} from '@/lib/types/spotify'

interface GraphPageProps {
    nodes: similarityGraphNode[],
    edges: similarityGraphEdge[],
    setNodes: (nodes: similarityGraphNode[]) => void;
    // doubleClickFn: (node: similarityGraphNode) => void;
}

const NetworkGraph = ({ nodes, edges, setNodes }: GraphPageProps) => {
    
    const graphRef = useRef<GraphCanvasRef | null>(null);
    const nodeRef = useRef(new Map());
    const {
        selections,
        actives,
        onNodeClick,
        onCanvasClick,
        onNodePointerOver,
        onNodePointerOut
    } = useSelection({
        ref: graphRef,
        nodes: nodes,
        edges: edges,
        selections: [],
        type: 'single',
        pathSelectionType: 'all',
        pathHoverType: 'all'
    });

    return (
        <>
            <GraphCanvas 
                ref={graphRef} 
                nodes={nodes} 
                edges={edges}
                edgeArrowPosition="none"
                selections={selections}
                actives={actives}
                // collapsedNodeIds={collapsedNodes}
                
                labelType="all"
                edgeLabelPosition="natural"
                
                // layout
                sizingType="centrality"
                minNodeSize={5}
                maxNodeSize={20}
                
                draggable
                layoutOverrides={{
                    linkDistance: 120,
                }}
                
                // highlighting
                onNodePointerOver={onNodePointerOver} 
                onNodePointerOut={onNodePointerOut}
                onNodeClick={onNodeClick} 
                onCanvasClick={onCanvasClick} 
                />;
        </>
    )
}

export default NetworkGraph;