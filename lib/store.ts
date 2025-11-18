import { create } from 'zustand';
import { AppId, WindowState } from '@/types';

interface AppStore {
  windows: Record<AppId, WindowState>;
  maxZIndex: number;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  bringToFront: (id: AppId) => void;
  updatePosition: (id: AppId, position: { x: number; y: number }) => void;
  updateSize: (id: AppId, size: { width: number; height: number }) => void;
}

const defaultWindows: Record<AppId, WindowState> = {
  'content-feed': {
    id: 'content-feed',
    title: 'Content Feed',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 100, y: 100 },
    size: { width: 800, height: 600 },
    zIndex: 1,
  },
  'bible-study': {
    id: 'bible-study',
    title: 'KJV Bible Study',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 150, y: 150 },
    size: { width: 900, height: 700 },
    zIndex: 1,
  },
  'sales-beast': {
    id: 'sales-beast',
    title: 'Sales Beast AI',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 200, y: 200 },
    size: { width: 700, height: 600 },
    zIndex: 1,
  },
  products: {
    id: 'products',
    title: 'Products Hub',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 250, y: 250 },
    size: { width: 1000, height: 700 },
    zIndex: 1,
  },
  radio: {
    id: 'radio',
    title: 'Final Fight Bible Radio',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 300, y: 300 },
    size: { width: 400, height: 300 },
    zIndex: 1,
  },
  counseling: {
    id: 'counseling',
    title: 'Private Counseling',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 350, y: 350 },
    size: { width: 600, height: 700 },
    zIndex: 1,
  },
  contact: {
    id: 'contact',
    title: 'Message Adam',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 400, y: 400 },
    size: { width: 500, height: 500 },
    zIndex: 1,
  },
};

export const useAppStore = create<AppStore>((set) => ({
  windows: defaultWindows,
  maxZIndex: 1,

  openWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: state.maxZIndex + 1,
        },
      },
      maxZIndex: state.maxZIndex + 1,
    })),

  closeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: false },
      },
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: !state.windows[id].isMinimized },
      },
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMaximized: !state.windows[id].isMaximized },
      },
    })),

  bringToFront: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], zIndex: state.maxZIndex + 1 },
      },
      maxZIndex: state.maxZIndex + 1,
    })),

  updatePosition: (id, position) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position },
      },
    })),

  updateSize: (id, size) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], size },
      },
    })),
}));
