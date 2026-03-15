import React from 'react';
import { ArrowRight, Clock, Database, Play } from 'lucide-react';
import { Algorithm } from '../types';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onSelect: (algorithm: Algorithm) => void;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm, onSelect }) => {
  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden cursor-pointer"
      onClick={() => onSelect(algorithm)}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
            {/* We can use dynamic icons here if needed, for now just a placeholder or passed prop */}
            <Database className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {algorithm.complexity.time}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {algorithm.name}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
          {algorithm.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Time: {algorithm.complexity.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>Space: {algorithm.complexity.space}</span>
            </div>
          </div>
          
          <button className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
