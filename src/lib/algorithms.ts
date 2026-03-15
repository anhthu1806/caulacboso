import { Step } from '../types';

export function* linearSearch(array: number[], target: number): Generator<Step> {
  for (let i = 0; i < array.length; i++) {
    yield {
      id: i,
      array: [...array],
      target,
      currentIndex: i,
      found: array[i] === target,
      description: `Kiểm tra phần tử tại chỉ số ${i}: ${array[i]}. ${array[i] === target ? 'Đã tìm thấy!' : 'Không phải giá trị cần tìm.'}`,
      codeLine: 2
    };

    if (array[i] === target) {
      return;
    }
  }

  yield {
    id: array.length,
    array: [...array],
    target,
    currentIndex: -1,
    found: false,
    description: `Đã duyệt hết mảng mà không tìm thấy giá trị ${target}.`,
    codeLine: 4
  };
}

export function* binarySearch(array: number[], target: number): Generator<Step> {
  // Binary search requires sorted array, but we assume the input is sorted or we sort it before passing?
  // Actually, for visualization, if the user inputs unsorted data for binary search, it won't work.
  // We should probably sort it or warn the user. For now, let's assume the visualizer handles sorting if binary is selected.
  
  let low = 0;
  let high = array.length - 1;
  let stepId = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    
    yield {
      id: stepId++,
      array: [...array],
      target,
      currentIndex: mid,
      low,
      high,
      mid,
      found: array[mid] === target,
      description: `Tính mid = floor((${low} + ${high}) / 2) = ${mid}. Giá trị tại mid là ${array[mid]}.`,
      codeLine: 3
    };

    if (array[mid] === target) {
      yield {
        id: stepId++,
        array: [...array],
        target,
        currentIndex: mid,
        low,
        high,
        mid,
        found: true,
        description: `Giá trị ${array[mid]} bằng với ${target}. Đã tìm thấy!`,
        codeLine: 4
      };
      return;
    }

    if (array[mid] < target) {
      yield {
        id: stepId++,
        array: [...array],
        target,
        currentIndex: mid,
        low,
        high,
        mid,
        found: false,
        description: `${array[mid]} < ${target}, nên ta tìm ở nửa bên phải. Cập nhật low = mid + 1 = ${mid + 1}.`,
        codeLine: 5
      };
      low = mid + 1;
    } else {
      yield {
        id: stepId++,
        array: [...array],
        target,
        currentIndex: mid,
        low,
        high,
        mid,
        found: false,
        description: `${array[mid]} > ${target}, nên ta tìm ở nửa bên trái. Cập nhật high = mid - 1 = ${mid - 1}.`,
        codeLine: 7
      };
      high = mid - 1;
    }
  }

  yield {
    id: stepId++,
    array: [...array],
    target,
    currentIndex: -1,
    low,
    high,
    found: false,
    description: `Low (${low}) > High (${high}). Không tìm thấy giá trị ${target} trong mảng.`,
    codeLine: 9
  };
}
