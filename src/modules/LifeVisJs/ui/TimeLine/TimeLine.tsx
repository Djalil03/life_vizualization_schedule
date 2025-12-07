import { useEffect, useRef } from 'react'
import { Timeline } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.css'


type Props = {
    items: any
    groups: any
    ranges: any
}


export default function LifeTimeline({ items, groups, ranges }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const timelineRef = useRef<any>(null)


    useEffect(() => {
        if (!containerRef.current) return

        const options = {
            editable: false,
            stack: true,
            multiselect: false,
            orientation: 'top',
            zoomMin: 1000 * 60 * 60 * 24 * 7,
            zoomMax: 1000 * 60 * 60 * 24 * 365 * 20,
            showCurrentTime: true,
            groupOrder: (a: any, b: any) => (a.id > b.id ? 1 : -1),
        }


        const combinedItems = items


        ranges?.forEach((r: any) => combinedItems.add(r))


        timelineRef.current = new Timeline(
            containerRef.current,
            combinedItems,
            groups,
            options
        );



        return () => {
            if (timelineRef.current) {
                timelineRef.current.destroy()
                timelineRef.current = null
            }
        }
    }, [items, groups, ranges])


    return <div ref={containerRef} style={{ height: 320, width: '100%' }} className="vis-timeline" />
}