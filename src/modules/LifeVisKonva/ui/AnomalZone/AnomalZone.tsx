import { Rect } from 'react-konva';

interface AnomalZoneProps {
    x: number;
    y: number;
    height: number;
    width: number;
}

export const AnomalZone = ({ x, y, height, width }: AnomalZoneProps) => (
    <>
        <Rect 
            x={x} 
            y={y} 
            height={height} 
            width={width} 
            fill={'#FF4136'}
            opacity={0.6}
        />
    </>
);
