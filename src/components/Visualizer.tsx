import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, BrainCircuit, GraduationCap } from 'lucide-react';
import { Algorithm, Step } from '../types';
import { linearSearch, binarySearch } from '../lib/algorithms';
import { generateRandomArray, sleep } from '../lib/utils';
import { ArrayDisplay } from './ArrayDisplay';
import { Controls } from './Controls';
import { ExplanationPanel } from './ExplanationPanel';
import { QuizModal } from './QuizModal';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

interface VisualizerProps {
  algorithm: Algorithm;
  onBack: () => void;
  apiKey: string;
  model: string;
}

export const Visualizer: React.FC<VisualizerProps> = ({ algorithm, onBack, apiKey, model }) => {
  const [arraySize, setArraySize] = useState(15);
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize array
  useEffect(() => {
    resetVisualization();
  }, [algorithm, arraySize]);

  const resetVisualization = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const isSorted = algorithm.id === 'binary';
    const newArray = generateRandomArray(arraySize, 1, 100, isSorted);
    setArray(newArray);
    
    // Pick a random target from the array or a random number
    const randomTarget = Math.random() > 0.3 
      ? newArray[Math.floor(Math.random() * newArray.length)] 
      : Math.floor(Math.random() * 100) + 1;
    setTarget(randomTarget);
    
    setSteps([]);
    setCurrentStepIndex(-1);
  };

  const generateSteps = useCallback(() => {
    const generator = algorithm.id === 'linear' 
      ? linearSearch(array, target) 
      : binarySearch(array, target);
    
    const newSteps: Step[] = [];
    for (const step of generator) {
      newSteps.push(step);
    }
    setSteps(newSteps);
    return newSteps;
  }, [algorithm, array, target]);

  // Generate steps whenever array or target changes
  useEffect(() => {
    generateSteps();
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  }, [array, target, generateSteps]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (currentStepIndex >= steps.length - 1) {
        // Restart if finished
        setCurrentStepIndex(-1);
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            
            // Check if found in the last step
            const lastStep = steps[steps.length - 1];
            if (lastStep.found) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
              Swal.fire({
                title: 'Tìm thấy!',
                text: `Đã tìm thấy giá trị ${target} tại chỉ số ${lastStep.currentIndex}.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
              });
            } else {
               Swal.fire({
                title: 'Kết thúc',
                text: `Không tìm thấy giá trị ${target} trong mảng.`,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
              });
            }
            
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed, target]);

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {algorithm.name}
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-mono">
                {algorithm.complexity.time}
              </span>
            </h2>
          </div>
        </div>
        
        <button
          onClick={() => setIsQuizOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all font-medium text-sm"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">Thử thách kiến thức</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Visualization & Controls */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto gap-6">
          {/* Visualization Area */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex-1 min-h-[300px] flex items-center justify-center relative">
             <div className="absolute top-4 left-4 text-sm text-slate-500 font-mono">
                Array Size: {array.length} | Target: {target}
             </div>
             <ArrayDisplay 
               array={currentStep ? currentStep.array : array} 
               step={currentStep} 
               algorithmType={algorithm.id} 
             />
          </div>

          {/* Controls */}
          <Controls 
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onStepForward={() => setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1))}
            onStepBackward={() => setCurrentStepIndex(prev => Math.max(prev - 1, -1))}
            onReset={() => {
              setCurrentStepIndex(-1);
              setIsPlaying(false);
            }}
            onRandomize={resetVisualization}
            speed={speed}
            onSpeedChange={setSpeed}
            arraySize={arraySize}
            onArraySizeChange={setArraySize}
            target={target}
            onTargetChange={(val) => {
              setTarget(val);
              setCurrentStepIndex(-1);
              setIsPlaying(false);
            }}
            maxSteps={steps.length}
            currentStep={currentStepIndex}
          />
        </div>

        {/* Right: Explanation & AI */}
        <div className="w-full lg:w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 overflow-y-auto">
          <ExplanationPanel 
            step={currentStep} 
            algorithmName={algorithm.name} 
            apiKey={apiKey}
            model={model}
          />
        </div>
      </div>

      <QuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        algorithmName={algorithm.name}
        apiKey={apiKey}
        model={model}
      />
    </div>
  );
};
