import { useCallback, useMemo, useState } from 'react';
import { Stage, Layer, Label, Tag, Text } from 'react-konva';
import { parseISO } from 'date-fns';
import { CATEGORY_COLORS, CATEGORY_Y_MAP, NODE_HEIGHT, PADDING_X, STAGE_HEIGHT } from './shared/const/konva';
import mockData from './shared/mockData/mockData.json';
import type { Event } from './shared/types';
import TimelineNode from './components/TimelineNode/TimelineNode';
import { useDynamicWidth } from './shared/lib/hooks/useDynamicWidth';
import './App.scss'
import { useTimelineCalculations } from './shared/lib/hooks/useTimelineCalculations';
import { useGetCalculateEdges } from './shared/lib/hooks/useGetCalculateEdges';
import GraphEdge from './components/GraphEdge/GraphEdge';

interface TooltipState {
  event: Event | null;
  x: number; 
  y: number;
}

const events = mockData as Event[];

function App() {
  const { ref: divRef, width: stageWidth } = useDynamicWidth<HTMLDivElement>();
  const [tooltipState, setTooltipState] = useState<TooltipState>({ event: null, x: 0, y: 0 });
  const { workingWidth, dateToX } = useTimelineCalculations(events, stageWidth) || {};
  const edges = useGetCalculateEdges(events, dateToX);

  const handleNodeHover = useCallback((eventData: Event | null, x: number, y: number) => {
    setTooltipState({ event: eventData, x, y });
  }, [setTooltipState]);

  const getEventInfo = useMemo(() => {
    if (!tooltipState.event) return '';
    const event = tooltipState.event;
    if (event.type === 'study') {
        return `${event.name}\n${event.details.degree} в ${event.details.faculty}\n${event.startDate} - ${event.endDate}`;
    } else if (event.type === 'work') {
        return `${event.name}\nРоль: ${event.details.role}\nКомпания: ${event.details.company || 'N/A'}\nСтек: ${event.details.stack?.join(', ')}\n${event.startDate} - ${event.endDate}`;
    } else if (event.type === 'project') {
        return `${event.name}\nКомпания: ${event.details.client || 'N/A'}\nСтек: ${event.details.stack?.join(', ')}\n${event.startDate} - ${event.endDate}`;
    }
  }, [tooltipState.event]);

  const renderTimelineNodes = useMemo(() => {
    return events.map((event) => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);

      const xStart = dateToX(startDate) + PADDING_X;
      const xEnd = dateToX(endDate) - PADDING_X;
      const width = xEnd - xStart;

      const yPosition = CATEGORY_Y_MAP[event.categoryId] || 500;
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

  return (
    <div className='app'>
      <h1>Визуализация жизненного графика</h1>
      <div ref={divRef} className='timeline-container'>
        <Stage width={workingWidth} height={STAGE_HEIGHT} className='stage'>
          <Layer>
            {renderGraphEdges}
            {renderTimelineNodes}
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
    </div>
  )
}

export default App
