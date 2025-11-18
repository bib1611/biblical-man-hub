'use client';

import { motion } from 'framer-motion';
import {
  Newspaper,
  Book,
  DollarSign,
  ShoppingCart,
  Radio,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { AppId } from '@/types';
import { useAppStore } from '@/lib/store';

interface DockItem {
  id: AppId;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const dockItems: DockItem[] = [
  {
    id: 'content-feed',
    label: 'Content Feed',
    icon: <Newspaper size={24} />,
    color: 'text-blue-400',
  },
  {
    id: 'bible-study',
    label: 'Bible Study',
    icon: <Book size={24} />,
    color: 'text-amber-400',
  },
  {
    id: 'sales-beast',
    label: 'Sales Beast AI',
    icon: <DollarSign size={24} />,
    color: 'text-green-400',
  },
  {
    id: 'products',
    label: 'Products Hub',
    icon: <ShoppingCart size={24} />,
    color: 'text-purple-400',
  },
  {
    id: 'radio',
    label: 'FFBR Radio',
    icon: <Radio size={24} />,
    color: 'text-red-400',
  },
  {
    id: 'counseling',
    label: 'Private Counseling',
    icon: <MessageCircle size={24} />,
    color: 'text-cyan-400',
  },
  {
    id: 'contact',
    label: 'Message Adam',
    icon: <Mail size={24} />,
    color: 'text-orange-400',
  },
];

export default function Dock() {
  const { openWindow, windows } = useAppStore();

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-gradient-to-b from-black via-red-950/20 to-black border-r border-red-900/30 backdrop-blur-md z-50 flex flex-col items-center py-6 gap-4">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="mb-4 w-14 h-14 bg-gradient-to-br from-red-600 to-red-900 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50"
      >
        <span className="text-2xl font-bold text-white">†</span>
      </motion.div>

      {/* Divider */}
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-800 to-transparent" />

      {/* Dock Items */}
      {dockItems.map((item, index) => {
        const isActive = windows[item.id].isOpen;

        return (
          <motion.button
            key={item.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.2, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openWindow(item.id)}
            className={`
              relative w-14 h-14 rounded-xl flex items-center justify-center
              transition-all duration-300 group
              ${
                isActive
                  ? 'bg-red-900/40 border-2 border-red-600/50 shadow-lg shadow-red-900/50'
                  : 'bg-gray-900/40 border border-gray-700/30 hover:bg-red-950/30'
              }
            `}
            title={item.label}
          >
            <div className={`${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="dock-active"
                className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-r-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}

            {/* Hover tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-black/90 border border-red-900/50 rounded-lg text-xs text-red-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
              {item.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-black/90" />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
