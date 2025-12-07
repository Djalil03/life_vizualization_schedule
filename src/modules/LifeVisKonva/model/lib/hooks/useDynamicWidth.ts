import { useEffect, useRef, useState } from "react";

export const useDynamicWidth = <T extends HTMLElement = HTMLDivElement>(): { ref: React.RefObject<T | null>, width: number } => {
    const ref = useRef<T | null>(null);
    const [width, setStageWidth] = useState(0);
    
    useEffect(() => {
        if (ref.current) {
        setStageWidth(ref.current.offsetWidth);
        }
        const handleResize = () => {
        if (ref.current) {
            setStageWidth(ref.current.offsetWidth);
        }
        };

        window.addEventListener('resize', handleResize);

        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []);

    return { ref, width };
};
