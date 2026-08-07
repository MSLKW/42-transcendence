import { useState, useRef, useCallback } from "react";

export const useDraggable = (initialPosition = { x: 0, y: 0 }) => {
    const [position, setPosition] = useState(initialPosition);
    const draggingRef = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggingRef.current) return;

        setPosition({
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y,
        });
    }, []);

    const handleMouseUp = useCallback(() => {
        draggingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;

        draggingRef.current = true;
        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return {
        position,
        handleMouseDown,
    };
};