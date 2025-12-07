import { useCallback, useMemo, useState, type JSX } from 'react';
import { Stage, Layer, Label, Tag, Text } from 'react-konva';
import { addYears, max, min, parseISO, startOfYear, isBefore } from 'date-fns';
import { CATEGORY_COLORS, CATEGORY_Y_MAP, NODE_HEIGHT, PADDING_X, STAGE_HEIGHT, VERTICAL_GAP } from '@/shared/const/konva';
import mockData from '@/shared/mockData/mockData.json';
import type { Event } from '@/shared/types';
import { useDynamicWidth } from '@/shared/lib/hooks/useDynamicWidth';
import { useTimelineCalculations } from '@/shared/lib/hooks/useTimelineCalculations';
import { useGetCalculateEdges } from '@/shared/lib/hooks/useGetCalculateEdges';
import { useGetOverlappingPeriods } from '@/shared/lib/hooks/useGetOverlappingPeriods';
import { useGetMap } from '@/shared/lib/hooks/useGetMap';
import TimelineNode from './TimelineNode/TimelineNode';
import GraphEdge from './GraphEdge/GraphEdge';
import { AnomalZone } from './AnomalZone/AnomalZone';
import { TimelineYears } from './Timeline/Timeline';
import cls from './LifeVizKonva.module.scss'

interface TooltipState {
  event: Event | null;
  x: number; 
  y: number;
}

const events = mockData as Event[];

const LifeVisKonva = () => {
  const { ref: divRef, width: stageWidth } = useDynamicWidth<HTMLDivElement>();
  const [tooltipState, setTooltipState] = useState<TooltipState>({ event: null, x: 0, y: 0 });
  const { workingWidth, dateToX } = useTimelineCalculations(events, stageWidth) || {};
  const edges = useGetCalculateEdges(events, dateToX);
  const overlappingPeriods = useGetOverlappingPeriods(events);
  const eventMap = useGetMap<string, Event>(events.map(event => [event.id, event]));

  const handleNodeHover = useCallback((eventData: Event | null, x: number, y: number) => {
    setTooltipState({ event: eventData, x, y });
  }, [setTooltipState]);

  const getEventInfo = useMemo(() => {
    if (!tooltipState.event) return '';
    const event = tooltipState.event;
    
    switch (event.type) {
    case 'study':
        return `${event.name}\n${event.details.degree} в ${event.details.faculty}\n${event.startDate} - ${event.endDate}`;
    case 'work':
        return `${event.name}\nРоль: ${event.details.role}\nКомпания: ${event.details.company || 'N/A'}\nСтек: ${event.details.stack?.join(', ')}\n${event.startDate} - ${event.endDate}`;
    case 'project':
        return `${event.name}\nКомпания: ${event.details.client || 'N/A'}\nСтек: ${event.details.stack?.join(', ')}\n${event.startDate} - ${event.endDate}`;
    case 'relocation':
        return `${event.name}\nПереезд в ${event.details.city}, ${event.details.country}\nПричина: ${event.details.reason}\n${event.startDate} - ${event.endDate}`;
    default:
        return '';
    }

  }, [tooltipState.event]);

  const renderAnomalies = useMemo(() => {
    const anomalies: JSX.Element[] = [];

    overlappingPeriods.forEach((conflictIds, eventId) => {
      const eventA = eventMap.get(eventId);
      if(!eventA) return;

      conflictIds.forEach(conflictId => {
        const eventB = eventMap.get(conflictId);
        if (!eventB || eventB.id === eventA.id) return;

        const startA = parseISO(eventA.startDate);
        const endA = parseISO(eventA.endDate);
        const startB = parseISO(eventB.startDate);
        const endB = parseISO(eventB.endDate);

        const overlapStart = max([startA, startB]);
        const overlapEnd = min([endA, endB]);

        const xStart = dateToX(overlapStart) - PADDING_X;
        const xEnd = dateToX(overlapEnd) + PADDING_X;
        const width = xEnd - xStart;

        const yA = CATEGORY_Y_MAP[eventA.categoryId];
        const yB = CATEGORY_Y_MAP[eventB.categoryId];
        
        const yMin = Math.min(yA, yB);
        const yMax = Math.max(yA, yB) + NODE_HEIGHT;

        if (width > 0) {
            anomalies.push(
                <AnomalZone
                    key={`${eventA.id}-${eventB.id}-anomaly`}
                    x={xStart}
                    width={width}
                    y={yMin - NODE_HEIGHT / 4}
                    height={yMax - yMin + NODE_HEIGHT / 2}
                />
            );
        }
      });
    });

    return anomalies;
  }, [dateToX, eventMap, overlappingPeriods]);

  const renderTimelineNodes = useMemo(() => {
    return events.map((event) => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);

      const xStart = dateToX(startDate) + PADDING_X;
      const xEnd = dateToX(endDate) - PADDING_X;
      const width = xEnd - xStart;

      const yPosition = CATEGORY_Y_MAP[event.categoryId] || 600; // Дефолтная позиция Y, если категория не найдена
      const color = CATEGORY_COLORS[event.categoryId] || '#9E9E9E';

      return (
        <TimelineNode
          key={event.id}
          event={event}
          x={xStart}
          width={width}
          yPosition={yPosition}
          height={NODE_HEIGHT}
          color={color}
          onNodeHover={handleNodeHover}
        />
      )
    })
  }, [dateToX, handleNodeHover]);

  const renderGraphEdges = useMemo(() => {
    return edges.map((edge) => {
      if (edge.source && edge.target) {
        return (
          <GraphEdge
            key={edge.id}
            source={edge.source}
            target={edge.target}
          />
        );
      }
      return null;
    });
  }, [edges]);

  const getTimelineStartEndPoints = useMemo(() => {
    const startEndPoints = []
    const dates = events.flatMap(event => [
      parseISO(event.startDate), 
      parseISO(event.endDate)
    ]);
    
    const minDate = min(dates);
    const maxDate = max(dates);

    const xStart = dateToX(minDate)
    const xEnd = dateToX(maxDate)

    startEndPoints.push(xStart + PADDING_X, STAGE_HEIGHT - VERTICAL_GAP, xEnd - PADDING_X, STAGE_HEIGHT - VERTICAL_GAP)

    return startEndPoints
  }, [dateToX])

  const getTimelineYearsPoints = useMemo(() => {
    const yearsPoints = []
    const dates = events.flatMap(event => [
      parseISO(event.startDate), 
    ]);
    
    const minDate = min(dates);
    const maxDate = max(dates);

    const startOfCurrentYear = startOfYear(minDate)
    const nextYear = addYears(startOfCurrentYear, 1)
  
    for (let i = nextYear; isBefore(i, maxDate); i = addYears(i, 1)) {
      yearsPoints.push(i)
    }

    return yearsPoints
  }, [])

  return (
    <div ref={divRef} className={cls.timelineContainer}>
        <Stage width={workingWidth} height={STAGE_HEIGHT} className={cls.stage}>
          <Layer>
              {renderGraphEdges}
              {renderAnomalies}
              {renderTimelineNodes}
              <TimelineYears 
                startEndPoints={getTimelineStartEndPoints}
                yearsPoints={getTimelineYearsPoints}
                dateToX={dateToX}
              />
          </Layer>
          <Layer>
            {tooltipState.event && (
                <Label
                  x={tooltipState.x}
                  y={tooltipState.y}
                  opacity={0.95}
                >
                  <Tag
                    fill="#2a2a2a"
                    pointerDirection="up"
                    pointerWidth={10}
                    pointerHeight={10}
                    lineJoin="round"
                    cornerRadius={5}
                  />
                  <Text
                    text={getEventInfo}
                    fontSize={14}
                    padding={12}
                    fill="#ffffff"
                  />
              </Label>
            )}
          </Layer>
        </Stage>
    </div>
  )
}

export default LifeVisKonva
