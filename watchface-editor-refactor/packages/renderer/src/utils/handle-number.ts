function limitNumber(num: number, min: number, max: number) {
  return Math.max(min, Math.min(num, max));
}

/** 找到最接近 target 的符合特定条件的 index */
function findClosestIndex<T>(
  target: number,
  array: Array<T>,
  condition: (item: T) => boolean
): number {
  let twoPointer: [number, number] = [Math.floor(target), Math.ceil(target)];

  if (Number.isInteger(target)) {
    if (target === 0) {
      twoPointer[1]++;
    } else {
      twoPointer[0]--;
    }
  }

  let twoPointerIndex: 0 | 1 = twoPointer[1] - target >= 0.5 ? 0 : 1;
  while (
    twoPointer[twoPointerIndex] >= 0 &&
    twoPointer[twoPointerIndex] < array.length &&
    !condition(array[twoPointer[twoPointerIndex]])
  ) {
    if (twoPointerIndex) {
      twoPointer[twoPointerIndex]++;
      if (twoPointer[0] >= 0) {
        twoPointerIndex = 0;
      }
    } else {
      twoPointer[twoPointerIndex]--;
      if (twoPointer[1] < array.length) {
        twoPointerIndex = 1;
      }
    }
  }

  return twoPointer[twoPointerIndex];
}

/** 乱序数组中找到最接近 target 的值 */
function findClosest(target: number, array: number[]) {
  let diff = Infinity;
  let result;
  for (const item of array) {
    const newDiff = Math.abs(target - item);
    if (newDiff < diff) {
      diff = newDiff;
      result = item;
    }
  }
  return result;
}

export { limitNumber, findClosestIndex, findClosest };
