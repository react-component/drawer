import classNames from 'classnames';
import * as React from 'react';

export type ResizeDirection = 'left' | 'right' | 'top' | 'bottom';

export interface ResizableLineProps {
  prefixCls?: string;
  direction: ResizeDirection;
  resizable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  minSize?: number;
  maxSize?: number;
  onResize?: (size: number) => void;
  onResizeEnd?: (size: number) => void;
  onResizeStart?: (size: number) => void;
}

const ResizableLine: React.FC<ResizableLineProps> = ({
  prefixCls = 'resizable',
  direction,
  resizable = false,
  className,
  style,
  minSize = 100,
  maxSize,
  onResize,
  onResizeEnd,
  onResizeStart,
}) => {
  const lineRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startPos, setStartPos] = React.useState(0);
  const [startSize, setStartSize] = React.useState(0);

  const isHorizontal = direction === 'left' || direction === 'right';

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);

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
    [isHorizontal, onResizeStart],
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
      setIsDragging(false);

      // Get the final size after resize
      const parentElement = lineRef.current?.parentElement;
      if (parentElement) {
        const rect = parentElement.getBoundingClientRect();
        const finalSize = isHorizontal ? rect.width : rect.height;
        onResizeEnd?.(finalSize);
      }
    }
  }, [isDragging, onResizeEnd, isHorizontal]);

  React.useEffect(() => {
    if (isDragging) {
      // Add global mouse event listeners during drag
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';

      return () => {
        // Clean up event listeners and styles
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, isHorizontal]);

  // Don't render if resizable is disabled
  if (!resizable) {
    return null;
  }

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
