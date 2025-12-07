import LifeTimeline from '../TimeLine/TimeLine'
import LifeGraph from '../LifeGraph/LifeGraph'
import cls from './LifeView.module.scss'

interface LifeViewProps {
    timelineItems: any
    timelineGroups: any
    backgroundRanges: any
    graphNodes: any
    graphEdges: any
}

export default function LifeView({ timelineItems, timelineGroups, backgroundRanges, graphNodes, graphEdges }: LifeViewProps) {
    return (
        <div>
            <section className={cls.card}>
                <h2>Таймлайн жизни</h2>
                <LifeTimeline items={timelineItems} groups={timelineGroups} ranges={backgroundRanges} />
            </section>


            <section className={cls.card}>
                <h2>Граф связей</h2>
                <LifeGraph nodes={graphNodes} edges={graphEdges} />
            </section>
        </div>
    )
}