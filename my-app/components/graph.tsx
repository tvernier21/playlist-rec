'use client'

import { useRef } from "react"
import { GraphCanvas, GraphCanvasRef, useSelection} from 'reagraph'

import type {
    similarityGraphNode,
    similarityGraphEdge,
} from '@/lib/types/spotify'

interface GraphPageProps {
    nodes: similarityGraphNode[],
    edges: similarityGraphEdge[],
    // doubleClickFn: (node: similarityGraphNode) => void;
}

const NetworkGraph = ({ nodes, edges }: GraphPageProps) => {
    const graphRef = useRef<GraphCanvasRef | null>(null);
    const {
        selections,
        onNodeClick,
        onCanvasClick,
    } = useSelection({
        ref: graphRef,
        nodes: nodes,
        edges: edges,
        selections: [],
        type: 'single'
    });

   return <GraphCanvas 
            ref={graphRef} 
            nodes={nodes} 
            edges={edges} 
            selections={selections} 
            // collapsedNodeIds={collapsedNodes}
            onNodeClick={onNodeClick} 
            onCanvasClick={onCanvasClick} 
          />;
}

export default NetworkGraph;