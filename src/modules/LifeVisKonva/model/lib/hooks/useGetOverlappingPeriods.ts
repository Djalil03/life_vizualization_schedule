import { parseISO } from 'date-fns';
import type { Event } from '../../../../../shared/types/index';
import { useMemo } from 'react';

const isOverlapping = (startA: Date, endA: Date, startB: Date, endB: Date): boolean => {
    // return !(startA < endB && endA < startB) || !(startB < endA && endB < startA);
    return startA < endB && startB < endA;
}

export const useGetOverlappingPeriods = (events: Event[]) => {
    return useMemo(() => {
        const overlappingPeriods= new Map<string, string[]>();

        for (let i = 0; i < events.length; i++) {
            const eventA = events[i];
            const startA = parseISO(eventA.startDate);
            const endA = parseISO(eventA.endDate);

            for (let j = i + 1; j < events.length; j++) {
                const eventB = events[j];
                const startB = parseISO(eventB.startDate);
                const endB = parseISO(eventB.endDate);

                const isSameType = eventA.type === eventB.type;
                if (isSameType) {
                    if (isOverlapping(startA, endA, startB, endB)) {
                        const overlapsA = overlappingPeriods.get(eventA.id) || []
                        overlappingPeriods.set(eventA.id, [...overlapsA, eventB.id]);

                        const overlapsB = overlappingPeriods.get(eventB.id) || []
                        overlappingPeriods.set(eventB.id, [...overlapsB, eventA.id]);
                    }
                }
            }
        }

        return overlappingPeriods;
    }, [events]);
}