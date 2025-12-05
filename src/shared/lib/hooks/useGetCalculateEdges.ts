import { useMemo } from 'react';
import type { Event } from '../../types';
import { CATEGORY_Y_MAP, NODE_HEIGHT, PADDING_X } from '@/shared/const/konva';
import { parseISO } from 'date-fns';
import { useGetMap } from './useGetMap';

interface Edge {
    id: string;
    sourceEvent: Event;
    targetEvent: Event;
    sourceId: string;
    targetId: string;
    source?: { x: number; y: number };
    target?: { x: number; y: number };
}

export const useGetCalculateEdges = (events: Event[], dateToX: (date: Date) => number) => {
    const eventMap = useGetMap<string, Event>(events.map(event => [event.id, event]));

    const edges: Edge[] = useMemo(() => {
        const generatedEdges: Edge[] = [];
        
        events.forEach(sourceEvent => {
            if (sourceEvent.relatedTo && sourceEvent.relatedTo.length > 0) {
                sourceEvent.relatedTo.forEach(targetId => {
                    const targetEvent = eventMap.get(targetId);
                    
                    if (targetEvent) {
                        generatedEdges.push({
                            id: `${sourceEvent.id}-${targetId}`,
                            sourceEvent: sourceEvent,
                            targetEvent: targetEvent,
                            sourceId: sourceEvent.id,
                            targetId: targetId,
                        });
                    }
                });
            }
        });
        return generatedEdges;
    }, [events, eventMap]);


    const calculatedEdges = useMemo(() => {
        return edges.map((edge, idx) => {
            const sourceX = dateToX(parseISO(edge.sourceEvent.endDate)) - PADDING_X;
            const sourceY = CATEGORY_Y_MAP[edge.sourceEvent.categoryId] + NODE_HEIGHT / 2;

            const targetX = dateToX(parseISO(edge.targetEvent.startDate)) + PADDING_X;
            const targetY = CATEGORY_Y_MAP[edge.targetEvent.categoryId] + NODE_HEIGHT / 2;

            return {
                ...edge,
                source: { x: sourceX, y: sourceY },
                target: { x: targetX, y: targetY },
            };
        })
    }, [edges, dateToX]);

    return calculatedEdges
};
