import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Step } from '../types';

interface ArrayDisplayProps {
  array: number[];
  step: Step | null;
  algorithmType: 'linear' | 'binary';
}

export const ArrayDisplay: React.FC<ArrayDisplayProps> = ({ array, step, algorithmType }) => {
  // If no step, just show the array normally
  if (!step) {
    return (
      <div className="flex items-end justify-center gap-1 h-64 w-full px-4 py-8 overflow-x-auto">
        {array.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 group"
            style={{ width: `${Math.max(2, 100 / array.length)}%` }}
          >
            <div
              className="w-full bg-blue-200 dark:bg-blue-900/30 rounded-t-md transition-all duration-300 group-hover:bg-blue-300"
              style={{ height: `${(value / Math.max(...array)) * 100}%` }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  const { currentIndex, low, high, mid, found } = step;

  return (
    <div className="flex items-end justify-center gap-1 h-64 w-full px-4 py-8 overflow-x-auto relative">
      {array.map((value, index) => {
        let bgColor = 'bg-blue-200 dark:bg-blue-900/30';
        let textColor = 'text-slate-500 dark:text-slate-400';
        let scale = 1;

        if (algorithmType === 'linear') {
          if (index === currentIndex) {
            bgColor = found ? 'bg-green-500' : 'bg-yellow-400';
            scale = 1.1;
            textColor = found ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold';
          } else if (index < currentIndex) {
            bgColor = 'bg-slate-300 dark:bg-slate-700'; // Visited
          }
        } else if (algorithmType === 'binary') {
          if (index === mid) {
            bgColor = found ? 'bg-green-500' : 'bg-yellow-400'; // Mid is currently checked
            scale = 1.1;
          } else if (low !== undefined && high !== undefined && (index < low || index > high)) {
            bgColor = 'bg-slate-100 dark:bg-slate-800 opacity-30'; // Out of range
          } else if (index === low || index === high) {
            bgColor = 'bg-blue-400'; // Bounds
          }
        }

        return (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, scale }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2 relative group"
            style={{ width: `${Math.max(30, 800 / array.length)}px` }}
          >
            {/* Value Bar */}
            <div
              className={cn(
                "w-full rounded-t-md transition-colors duration-300 relative",
                bgColor
              )}
              style={{ height: `${(value / Math.max(...array, 1)) * 200}px` }}
            >
               {/* Value Label inside bar if tall enough, else outside */}
               <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 dark:text-slate-300 pointer-events-none">
                 {value}
               </span>
            </div>

            {/* Index Label */}
            <span className={cn("text-xs font-mono transition-colors", textColor)}>
              {index}
            </span>

            {/* Pointers for Binary Search */}
            {algorithmType === 'binary' && (
              <div className="absolute -bottom-8 flex flex-col items-center">
                {index === low && (
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Low</span>
                )}
                {index === high && (
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">High</span>
                )}
                {index === mid && (
                  <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mt-1">Mid</span>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
