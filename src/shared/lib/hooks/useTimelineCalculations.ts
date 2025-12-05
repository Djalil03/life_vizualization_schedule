import { useMemo, useCallback } from 'react';
import { parseISO, min, max, differenceInDays } from 'date-fns';
import type { Event } from '../../types/index';

interface TimelineCalculations {
  minDate: Date;
  maxDate: Date;
  totalDays: number;
  scaleFactor: number;
  workingWidth: number;
  dateToX: (date: Date) => number;
}

export function useTimelineCalculations(
  events: Event[], 
  stageWidth: number
): TimelineCalculations {

  const dateCalculations = useMemo(() => {
    const dates = events.flatMap(event => [
      parseISO(event.startDate), 
      parseISO(event.endDate)
    ]);
    
    const minDate = min(dates);
    const maxDate = max(dates);
    
    const totalDays = differenceInDays(maxDate, minDate);
    
    return { minDate, maxDate, totalDays };
  }, [events]);

  const { minDate, maxDate, totalDays } = dateCalculations;
  
  const workingWidth = stageWidth;
  const scaleFactor = totalDays > 0 ? workingWidth / totalDays : 0;

  const dateToX = useCallback((date: Date): number => {
    const daysSinceMin = differenceInDays(date, minDate);
    
    return daysSinceMin * scaleFactor; 
  }, [minDate, scaleFactor]);

  return {
    minDate,
    maxDate,
    totalDays,
    scaleFactor,
    workingWidth,
    dateToX,
  };
}