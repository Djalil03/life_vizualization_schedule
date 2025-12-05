import React from 'react';
import { Line } from 'react-konva';

interface GraphEdgeProps {
    source: { x: number; y: number; };
    target: { x: number; y: number; };
}

const GraphEdge: React.FC<GraphEdgeProps> = ({ source, target }) => {
    const isStraight = source.y === target.y;

    const midX = (source.x + target.x) / 2;
    const midYOffset = 0;
    
    const points: number[] = [source.x, source.y , target.x, target.y];
    
    if (!isStraight) {
        points.push(
            source.x, source.y + midYOffset,
            target.x, target.y - midYOffset,
        );
    }
    
    // Конечная точка
    points.push(target.x, target.y);

    return (
        <Line
            points={points}
            stroke="#6c757d" // Серый цвет
            strokeWidth={2}
            lineCap="round"
            tension={0.5} // Регулирует гладкость кривой
            // Добавляем стрелку на конце
            // Конфигурация стрелки в Konva может быть сложной. Для простоты пока ограничимся линией.
        />
    );
};

export default GraphEdge;