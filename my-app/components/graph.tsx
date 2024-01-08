'use client'

import { GraphCanvas } from 'reagraph'

import type {
    similarityGraphNode,
    similarityGraphEdge,
} from '@/lib/types/spotify'

interface GraphPageProps {
    nodes: similarityGraphNode[],
    edges: similarityGraphEdge[],
}

const GraphPage: React.FC<GraphPageProps> = ({
    nodes,
    edges
}) => {
    return (
        <div style={{ position: "fixed", width: '100%', height: '100%'}}>
            <GraphCanvas
                nodes={nodes}
                edges={edges}
            />
        </div>
    )
}

export default GraphPage;