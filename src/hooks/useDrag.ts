import * as React from 'react';
import { clsx } from 'clsx';
import type { Placement } from '../Drawer';
import { useEvent } from '@rc-component/util';

export interface UseDragOptions {
  prefixCls: string;
  direction: Placement;
  className?: string;
  style?: React.CSSProperties;
  maxSize?: number;
  containerRef?: React.RefObject<HTMLElement>;
  currentSize?: number | string;
  onResize?: (size: number) => void;
  onResizeEnd?: (size: number) => void;
  onResizeStart?: (size: number) => void;
}

export interface UseDragReturn {
  dragElementProps: {
    className: string;
    style: React.CSSProperties;
    onMouseDown: (e: React.MouseEvent) => void;
  };
  isDragging: boolean;
}

export default function useDrag(options: UseDragOptions): UseDragReturn {
  const {
    prefixCls,
    direction,
    className,
    style,
    maxSize,
    containerRef,
    currentSize,
    onResize,
    onResizeEnd,
    onResizeStart,
  } = options;

  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const [startPos, setStartPos] = React.useState<number>(0);
  const [startSize, setStartSize] = React.useState<number>(0);

  const isHorizontal = direction === 'left' || direction === 'right';

  const handleMouseDown = useEvent((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    if (isHorizontal) {
      setStartPos(e.clientX);
    } else {
      setStartPos(e.clientY);
    }

    // Use provided currentSize, or fallback to container size
    let startSize: number;
    if (typeof currentSize === 'number') {
      startSize = currentSize;
    } else if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      startSize = isHorizontal ? rect.width : rect.height;
    }

    setStartSize(startSize);
    onResizeStart?.(startSize);
  });

  const handleMouseMove = useEvent((e: MouseEvent) => {
    if (!isDragging) return;

    const currentPos = isHorizontal ? e.clientX : e.clientY;
    let delta = currentPos - startPos;

    // Adjust delta direction based on placement
    if (direction === 'right' || direction === 'bottom') {
      delta = -delta;
    }

    let newSize = startSize + delta;

    // Apply min/max size limits
    if (newSize < 0) {
      newSize = 0;
    }
    // Only apply maxSize if it's a valid positive number
    if (maxSize && newSize > maxSize) {
      newSize = maxSize;
    }

    onResize?.(newSize);
  });

  const handleMouseUp = React.useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      // Get the final size after resize
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const finalSize = isHorizontal ? rect.width : rect.height;
        onResizeEnd?.(finalSize);
      }
    }
  }, [isDragging, containerRef, onResizeEnd, isHorizontal]);

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

  const dragElementClassName = clsx(
    `${prefixCls}-dragger`,
    `${prefixCls}-dragger-${direction}`,
    {
      [`${prefixCls}-dragger-dragging`]: isDragging,
      [`${prefixCls}-dragger-horizontal`]: isHorizontal,
      [`${prefixCls}-dragger-vertical`]: !isHorizontal,
    },
    className,
  );

  return {
    dragElementProps: {
      className: dragElementClassName,
      style,
      onMouseDown: handleMouseDown,
    },
    isDragging,
  };
}
