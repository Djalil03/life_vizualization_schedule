import LifeView from './LifeView/LifeView'
import events from '@/shared/mockData/mockData.json'
import { buildLifeVisualizationData } from '@/shared/lib/utils/converters'

export default function LifeVisJs() {
    const data = buildLifeVisualizationData(events)

    return (
        <LifeView
            timelineItems={data.timelineItems}
            timelineGroups={data.timelineGroups}
            backgroundRanges={data.backgroundRanges}
            graphNodes={data.graphNodes}
            graphEdges={data.graphEdges}
        />
    )
}
