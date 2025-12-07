import { useEffect, useRef } from 'react'
import { Network } from 'vis-network/standalone'
import 'vis-network/styles/vis-network.css'

type Props = {
nodes: any
edges: any
}

export default function LifeGraph({ nodes, edges }: Props) {
    const ref = useRef<HTMLDivElement | null>(null)
    const networkRef = useRef<any>(null)

    useEffect(() => {
        if (!ref.current) return

        const data = { nodes, edges }

        const options = {
            nodes: {
                shape: 'dot',
                size: 18,
                font: { size: 14 },
            },
            edges: {
                arrows: {
                    to: { enabled: true, scaleFactor: 0.6 }
                },
                // smooth: { enabled: true, type: 'dynamic' }
            },
            physics: {
                stabilization: true,
                barnesHut: { gravitationalConstant: -8000 }
            },
            interaction: {
                hover: true,
                tooltipDelay: 100,
                zoomView: true,
                dragView: true
            }
        }

        networkRef.current = new Network(ref.current, data, options)

        networkRef.current.on('click', function (params: any) {
            if (params.nodes && params.nodes.length) {
                const nodeId = params.nodes[0]
                const node = nodes.get(nodeId)

                console.log('Node clicked', node)
            }
        })

        return () => networkRef.current && networkRef.current.destroy()
    }, [nodes, edges])


    return <div ref={ref} style={{ width: '100%', height: 420 }} />
}