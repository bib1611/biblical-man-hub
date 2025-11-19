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
    title: 'Bible Study',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 150, y: 150 },
    size: { width: 900, height: 700 },
    zIndex: 1,
  },
  sam: {
    id: 'sam',
    title: 'Chat with Sam',
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
    title: "The King's Radio",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 250, y: 100 },
    size: { width: 800, height: 900 },
    zIndex: 1,
  },
  counseling: {
    id: 'counseling',
    title: 'Recent Substack Articles',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 300, y: 100 },
    size: { width: 900, height: 800 },
    zIndex: 1,
  },
  about: {
    id: 'about',
    title: 'About',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 200, y: 80 },
    size: { width: 900, height: 800 },
    zIndex: 1,
  },
  'start-here': {
    id: 'start-here',
    title: 'Start Here',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 220, y: 100 },
    size: { width: 900, height: 800 },
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
  admin: {
    id: 'admin',
    title: 'Admin Dashboard',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { x: 50, y: 50 },
    size: { width: 1200, height: 800 },
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
