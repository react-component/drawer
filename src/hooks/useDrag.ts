import * as React from 'react';
import classNames from 'classnames';
import type { Placement } from '../Drawer';

export interface UseDragOptions {
  prefixCls?: string;
  direction: Placement;
  className?: string;
  style?: React.CSSProperties;
  minSize?: number;
  maxSize?: number;
  disabled?: boolean;
  container?: HTMLElement | null;
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
    prefixCls = 'resizable',
    direction,
    className,
    style,
    minSize = 100,
    maxSize,
    disabled = false,
    container,
    onResize,
    onResizeEnd,
    onResizeStart,
  } = options;

  const [isDragging, setIsDragging] = React.useState(false);
  const [startPos, setStartPos] = React.useState(0);
  const [startSize, setStartSize] = React.useState(0);

  const isHorizontal = direction === 'left' || direction === 'right';

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);

      if (isHorizontal) {
        setStartPos(e.clientX);
      } else {
        setStartPos(e.clientY);
      }

      // Get the current size of the container
      if (container) {
        const rect = container.getBoundingClientRect();
        const currentSize = isHorizontal ? rect.width : rect.height;
        setStartSize(currentSize);
        onResizeStart?.(currentSize);
      }
    },
    [disabled, isHorizontal, container, onResizeStart],
  );

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return;

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
      disabled,
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
    if (isDragging && !disabled) {
      setIsDragging(false);

      // Get the final size after resize
      if (container) {
        const rect = container.getBoundingClientRect();
        const finalSize = isHorizontal ? rect.width : rect.height;
        onResizeEnd?.(finalSize);
      }
    }
  }, [isDragging, disabled, container, onResizeEnd, isHorizontal]);

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

  const dragElementClassName = classNames(
    `${prefixCls}-dragger`,
    `${prefixCls}-dragger-${direction}`,
    {
      [`${prefixCls}-dragger-dragging`]: isDragging,
      [`${prefixCls}-dragger-horizontal`]: isHorizontal,
      [`${prefixCls}-dragger-vertical`]: !isHorizontal,
    },
    className,
  );

  const dragElementStyle: React.CSSProperties = {
    ...style,
  };

  return {
    dragElementProps: {
      className: dragElementClassName,
      style: dragElementStyle,
      onMouseDown: handleMouseDown,
    },
    isDragging,
  };
}
