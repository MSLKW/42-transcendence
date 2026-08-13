import React, { useState, useRef, useEffect } from 'react';

// Define the structure for a button
interface ButtonItem {
  id: string;
  label: string;
  initialX: number;
  initialY: number;
}

const INITIAL_BUTTONS: ButtonItem[] = [
  { id: 'btn-1', label: 'Button 1', initialX: 50, initialY: 50 },
  { id: 'btn-2', label: 'Button 2', initialX: 250, initialY: 200 },
  { id: 'btn-3', label: 'Button 3', initialX: 450, initialY: 100 },
];

export const DraggableSwapButtons: React.FC = () => {
  // Store the current coordinates and home positions of the buttons
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    INITIAL_BUTTONS.forEach((b) => {
      pos[b.id] = { x: b.initialX, y: b.initialY };
    });
    return pos;
  });

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Keep a ref of positions to access inside event listeners without closure staleness
  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Handle Mouse Down on a button to start dragging
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const btnElement = buttonRefs.current[id];
    if (!btnElement) return;

    const rect = btnElement.getBoundingClientRect();
    // Calculate offset from mouse click to top-left corner of the button
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingId(id);
    setCurrentMousePos({ x: e.clientX, y: e.clientY });
  };

  // Global mouse move and mouse up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingId) return;
      setCurrentMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (!draggingId) return;

      const draggedElement = buttonRefs.current[draggingId];
      if (draggedElement) {
        const draggedRect = draggedElement.getBoundingClientRect();
        let hoveredId: string | null = null;

        // Check intersection with other buttons
        for (const btn of INITIAL_BUTTONS) {
          if (btn.id === draggingId) continue;
          const otherElement = buttonRefs.current[btn.id];
          if (otherElement) {
            const otherRect = otherElement.getBoundingClientRect();

            // Simple bounding box collision detection (overlap check)
            const isOverlapping =
              draggedRect.left < otherRect.right &&
              draggedRect.right > otherRect.left &&
              draggedRect.top < otherRect.bottom &&
              draggedRect.bottom > otherRect.top;

            if (isOverlapping) {
              hoveredId = btn.id;
              break;
            }
          }
        }

        if (hoveredId) {
          // Swap positions with the hovered button
          setPositions((prev) => {
            const currentDraggedPos = prev[draggingId];
            const currentHoveredPos = prev[hoveredId!];
            return {
              ...prev,
              [draggingId]: currentHoveredPos,
              [hoveredId!]: currentDraggedPos,
            };
          });
        }
        // If hoveredId is null, it automatically snaps back because state positions aren't changed
      }

      setDraggingId(null);
    };

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId]);

  return (
    <div className="relative w-full h-[500px] border border-gray-300 rounded-lg bg-gray-50 overflow-hidden select-none">
      <div className="absolute top-4 left-4 text-sm text-gray-500 pointer-events-none">
        Click and drag any button over another to swap their positions!
      </div>

      {INITIAL_BUTTONS.map((btn) => {
        const isDragging = draggingId === btn.id;
        const pos = isDragging
          ? {
              x: currentMousePos.x - dragOffset.x,
              y: currentMousePos.y - dragOffset.y,
            }
          : positions[btn.id];

        return (
          <button
            key={btn.id}
            ref={(el) => (buttonRefs.current[btn.id] = el)}
            onMouseDown={(e) => handleMouseDown(e, btn.id)}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px`,
              zIndex: isDragging ? 50 : 10,
            }}
            className={`absolute px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
              isDragging ? 'bg-blue-600 shadow-xl scale-105' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
};