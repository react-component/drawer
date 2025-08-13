import classNames from 'classnames';
import * as React from 'react';
import type { Placement } from './Drawer';

export interface ResizableLineProps {
  prefixCls?: string;
  direction: Placement;
  className?: string;
  style?: React.CSSProperties;
  minSize?: number;
  maxSize?: number;
  isDragging?: boolean;
  onResize?: (size: number) => void;
  onResizeEnd?: (size: number) => void;
  onResizeStart?: (size: number) => void;
  onDraggingChange?: (dragging: boolean) => void;
}

const ResizableLine: React.FC<ResizableLineProps> = ({
  prefixCls = 'resizable',
  direction,
  className,
  style,
  minSize = 100,
  maxSize,
  isDragging = false,
  onResize,
  onResizeEnd,
  onResizeStart,
  onDraggingChange,
}) => {
  const lineRef = React.useRef<HTMLDivElement>(null);
  const [startPos, setStartPos] = React.useState(0);
  const [startSize, setStartSize] = React.useState(0);

  const isHorizontal = direction === 'left' || direction === 'right';

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      onDraggingChange?.(true);

      if (isHorizontal) {
        setStartPos(e.clientX);
      } else {
        setStartPos(e.clientY);
      }

      // Get the current size of the parent container
      const parentElement = lineRef.current?.parentElement;
      if (parentElement) {
        const rect = parentElement.getBoundingClientRect();
        const currentSize = isHorizontal ? rect.width : rect.height;
        setStartSize(currentSize);
        onResizeStart?.(currentSize);
      }
    },
    [isHorizontal, onResizeStart, onDraggingChange],
  );

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const currentPos = isHorizontal ? e.clientX : e.clientY;
      let delta = currentPos - startPos;

      // Adjust delta direction based on placement
      if (direction === 'right' || direction === 'bottom') {
        delta = -delta;
      }

      let newSize = startSize + delta;

      // Apply min/max size limits
      if (newSize < minSize) {
        newSize = minSize;
      }
      // Only apply maxSize if it's a valid positive number
      if (maxSize !== undefined && maxSize > 0 && newSize > maxSize) {
        newSize = maxSize;
      }

      onResize?.(newSize);
    },
    [
      isDragging,
      startPos,
      startSize,
      direction,
      minSize,
      maxSize,
      onResize,
      isHorizontal,
    ],
  );

  const handleMouseUp = React.useCallback(() => {
    if (isDragging) {
      onDraggingChange?.(false);

      // Get the final size after resize
      const parentElement = lineRef.current?.parentElement;
      if (parentElement) {
        const rect = parentElement.getBoundingClientRect();
        const finalSize = isHorizontal ? rect.width : rect.height;
        onResizeEnd?.(finalSize);
      }
    }
  }, [isDragging, onResizeEnd, isHorizontal, onDraggingChange]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const resizeLineClassName = classNames(
    `${prefixCls}-line`,
    `${prefixCls}-line-${direction}`,
    {
      [`${prefixCls}-line-dragging`]: isDragging,
    },
    className,
  );

  const resizeLineStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: 2,
    cursor: isHorizontal ? 'col-resize' : 'row-resize',
    ...style,
  };

  return (
    <div
      ref={lineRef}
      className={resizeLineClassName}
      style={resizeLineStyle}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ResizableLine;
