import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Shuffle } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onRandomize: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  target: number;
  onTargetChange: (target: number) => void;
  maxSteps: number;
  currentStep: number;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onRandomize,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  target,
  onTargetChange,
  maxSteps,
  currentStep,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-6">
      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          title="Bước trước"
        >
          <SkipBack className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        <button
          onClick={onPlayPause}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white shadow-lg flex items-center justify-center transform active:scale-95 transition-all"
          title={isPlaying ? "Tạm dừng" : "Phát"}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        <button
          onClick={onStepForward}
          disabled={currentStep === maxSteps - 1}
          className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          title="Bước tiếp"
        >
          <SkipForward className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        <button
          onClick={onReset}
          className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ml-4"
          title="Làm mới"
        >
          <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Sliders & Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tốc độ: {speed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Kích thước mảng: {arraySize}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={arraySize}
              onChange={(e) => onArraySizeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Giá trị cần tìm (Target)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={target}
                onChange={(e) => onTargetChange(parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white"
              />
              <button
                onClick={onRandomize}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-300"
                title="Tạo mảng ngẫu nhiên"
              >
                <Shuffle className="w-4 h-4" />
                Random
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tiến độ: {currentStep + 1} / {maxSteps}
            </label>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / maxSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
