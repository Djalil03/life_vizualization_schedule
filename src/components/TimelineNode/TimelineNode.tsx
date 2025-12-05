import type { Event } from '@/shared/types';
import { useCallback, } from 'react';
import { Rect, Text } from 'react-konva';

interface TimelineNodeProps {
    event: Event;
    x: number; // Начальная координата X
    width: number; // Ширина полосы
    yPosition: number; // Координата Y (для "дорожки")
    height: number;
    color: string;
    onNodeHover?: (event: Event | null, x: number, y: number) => void;
}

const TimelineNode = (props: TimelineNodeProps) => {
    const {
        event,
        x,
        width,
        yPosition,
        height,
        color,
        onNodeHover
    } = props;
    const yCenter = yPosition + height / 2;

    const handleMouseEnter = useCallback(() => {
        onNodeHover?.(event, x + width / 2, yPosition + height + 10);
    }, [event, onNodeHover, width, x, yPosition, height]);

    const handleMouseLeave = useCallback(() => {
        onNodeHover?.(null, 0, 0)
    }, [onNodeHover]);

    return (
        <>
            <Rect
                x={x}
                y={yPosition}
                width={width}
                height={height}
                fill={color}
                cornerRadius={4}
                shadowBlur={4}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />

            <Text
                text={event.name}
                x={x + 10}
                y={yPosition + height / 2 - 7}
                fontSize={14}
                fill="white"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                visible={width > 150}
            />
        </>
    );
};

export default TimelineNode;
