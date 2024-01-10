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

    return <GraphCanvas 
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

        // highlighting
        onNodePointerOver={onNodePointerOver} 
        onNodePointerOut={onNodePointerOut}
        onNodeClick={onNodeClick} 
        onCanvasClick={onCanvasClick} 
    />;
}

export default NetworkGraph;