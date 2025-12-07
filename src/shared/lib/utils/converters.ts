import { DataSet } from 'vis-data'

type EventItem = any

const categoryMap: Record<string, string> = {
    education: 'Образование',
    career: 'Карьера',
    projects: 'Проекты',
    relocation: 'Переезды',
}

export function convertToTimelineItems(events: EventItem[]) {
    return new DataSet(
        events.map((e) => ({
            id: e.id,
            content: e.name,
            start: e.startDate,
            end: e.endDate,
            group: e.categoryId,
            title: `${e.name} — ${e.startDate}${e.endDate ? ' → ' + e.endDate : ''}`,
        }))
    )
}

export function convertToGroups(events: EventItem[]) {
    const unique = Array.from(new Set(events.map((e) => e.categoryId)))
    return new DataSet(
        unique.map((id) => ({ id, content: categoryMap[id] || id }))
    )
}

export function convertToBackgroundRanges(events: EventItem[]) {
// Example: mark 2020 as an anomaly zone if multiple events happened that year
// For demo we create a simple static anomaly: COVID-ish period
return new DataSet([
        
    ])
}

export function convertToGraphNodes(events: EventItem[]) {
    return new DataSet(
        events.map((e) => ({
            id: e.id,
            label: e.name,
            title: `${e.name}\n${e.startDate}${e.endDate ? ' → ' + e.endDate : ''}`,
            shape: 'dot',
            size: 18
        }))
    )
}

export function convertToGraphEdges(events: EventItem[]) {
    const edges: any[] = []
    events.forEach((e) => {
        if (!e.relatedTo) return
            e.relatedTo.forEach((toId: string) => {
            edges.push({ from: e.id, to: toId, arrows: 'to' })
        })
    })
    return new DataSet(edges)
}

export function buildLifeVisualizationData(events: EventItem[]) {
    return {
        timelineItems: convertToTimelineItems(events),
        timelineGroups: convertToGroups(events),
        backgroundRanges: convertToBackgroundRanges(events),
        graphNodes: convertToGraphNodes(events),
        graphEdges: convertToGraphEdges(events),
    }
}
