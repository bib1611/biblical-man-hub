// Core type definitions for Biblical Man Hub

export type AppId =
  | 'content-feed'
  | 'bible-study'
  | 'sales-beast'
  | 'products'
  | 'radio'
  | 'counseling'
  | 'contact';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface ContentFeedItem {
  id: string;
  title: string;
  platform: 'Substack' | 'Beehiiv' | 'Gumroad' | 'Twitter';
  preview: string;
  url: string;
  date: string;
  content?: string;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleBook {
  name: string;
  chapters: number;
  testament: 'OT' | 'NT';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'marriage' | 'men' | 'women' | 'parenting' | 'devotionals' | 'courses';
  gumroadUrl: string;
  coverImage?: string;
  features: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'adam';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  note?: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string;
  createdAt: string;
}
