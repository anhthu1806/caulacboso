import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomArray(size: number, min: number, max: number, sorted: boolean = false): number[] {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  if (sorted) {
    return arr.sort((a, b) => a - b);
  }
  return arr;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
