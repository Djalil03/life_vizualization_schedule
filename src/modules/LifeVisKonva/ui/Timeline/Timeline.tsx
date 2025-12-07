import React from "react";
import { Line, Text } from "react-konva";
import { format } from "date-fns";
import { PADDING_X, STAGE_HEIGHT, VERTICAL_GAP } from "@/shared/const/konva";

interface TimelineProps {
    startEndPoints: number[];
    yearsPoints: Date[];
    dateToX: (date: Date) => number;
}

export const TimelineYears = ({startEndPoints, yearsPoints, dateToX}: TimelineProps) => (
    <>
        <Line 
            points={startEndPoints}
            stroke="#6c757d"
            strokeWidth={4}
            lineCap="round"
            tension={0.5}
        />
        {
            yearsPoints.map(year => {
                const xPosition = dateToX(year) + PADDING_X
                const formatted = format(year, 'yyyy')

                return (
                    <React.Fragment key={formatted}>
                        <Text
                            x={xPosition - 15}
                            y={STAGE_HEIGHT - VERTICAL_GAP - 40}
                            text={formatted}
                            fontSize={14}
                            fill="#000"
                        />
                        <Line 
                            points={[xPosition, STAGE_HEIGHT - VERTICAL_GAP, xPosition, STAGE_HEIGHT - VERTICAL_GAP - 20]}
                            stroke="#6c757d"
                            strokeWidth={4}
                            lineCap="round"
                            tension={0.5}
                        />
                    </React.Fragment>
                )
            })
        }
    </>
);
