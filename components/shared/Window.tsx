'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { AppId } from '@/types';
import { useAppStore } from '@/lib/store';

interface WindowProps {
  id: AppId;
  children: React.ReactNode;
}

export default function Window({ id, children }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    bringToFront,
    updatePosition,
  } = useAppStore();

  const windowState = windows[id];

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;

    setIsDragging(true);
    bringToFront(id);
    setDragOffset({
      x: e.clientX - windowState.position.x,
      y: e.clientY - windowState.position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep window within viewport
      const maxX = globalThis.window.innerWidth - 200;
      const maxY = globalThis.window.innerHeight - 100;

      updatePosition(id, {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      globalThis.window.addEventListener('mousemove', handleMouseMove);
      globalThis.window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      globalThis.window.removeEventListener('mousemove', handleMouseMove);
      globalThis.window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, updatePosition]);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const windowStyle = windowState.isMaximized
    ? { top: 0, left: 80, right: 0, bottom: 0, width: 'calc(100% - 80px)', height: '100%' }
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
      };

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed overflow-hidden rounded-lg shadow-2xl border border-red-900/50 bg-black/95 backdrop-blur-md"
      style={{
        ...windowStyle,
        zIndex: windowState.zIndex,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Window Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-950/80 to-black/80 border-b border-red-900/30 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-sm font-bold text-red-100 tracking-wide uppercase">
          {windowState.title}
        </h2>

        {/* Window Controls */}
        <div className="window-controls flex items-center gap-2">
          <button
            onClick={() => minimizeWindow(id)}
            className="w-8 h-8 rounded-full bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-700/50 flex items-center justify-center transition-all hover:scale-110"
            title="Minimize"
          >
            <Minus size={14} className="text-yellow-400" />
          </button>
          <button
            onClick={() => maximizeWindow(id)}
            className="w-8 h-8 rounded-full bg-green-600/20 hover:bg-green-600/40 border border-green-700/50 flex items-center justify-center transition-all hover:scale-110"
            title="Maximize"
          >
            <Square size={12} className="text-green-400" />
          </button>
          <button
            onClick={() => closeWindow(id)}
            className="w-8 h-8 rounded-full bg-red-600/20 hover:bg-red-600/60 border border-red-700/50 flex items-center justify-center transition-all hover:scale-110"
            title="Close"
          >
            <X size={14} className="text-red-400" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-52px)] overflow-auto bg-black/40 backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
  );
}
