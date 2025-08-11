import classNames from 'classnames';
import * as React from 'react';

export type ResizeDirection = 'left' | 'right' | 'top' | 'bottom';

export interface ResizableLineProps {
  /** 样式类名前缀 */
  prefixCls?: string;
  /** 调整大小的方向 */
  direction: ResizeDirection;
  /** 是否启用调整大小功能 */
  resizable?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 最小尺寸限制 */
  minSize?: number;
  /** 最大尺寸限制 */
  maxSize?: number;
  /** 调整大小时的回调 */
  onResize?: (size: number) => void;
  /** 调整大小结束时的回调 */
  onResizeEnd?: (size: number) => void;
  /** 开始调整大小时的回调 */
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

      // 获取父容器当前大小
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

      // 根据方向调整增量方向
      if (direction === 'right' || direction === 'bottom') {
        delta = -delta;
      }

      let newSize = startSize + delta;

      // 应用最小最大值限制
      if (newSize < minSize) {
        newSize = minSize;
      }
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

      // 获取最终大小
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, isHorizontal]);

  // 如果没有启用 resizable，不渲染
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
    zIndex: 1, // 提高 z-index 确保在最顶层
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
