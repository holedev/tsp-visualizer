import { Point } from './cities-data'

export interface Path {
  points: Point[]
  distance: number
}

export type AlgorithmType = 'bruteforce' | 'nearest-neighbor' | 'christofides' | 'simulated-annealing' | 'hybrid'

export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

export function calculateTotalDistance(path: Point[]): number {
  let total = 0
  for (let i = 0; i < path.length - 1; i++) {
    total += calculateDistance(path[i], path[i + 1])
  }
  if (path.length > 2) {
    total += calculateDistance(path[path.length - 1], path[0])
  }
  return total
}

function swapArrayElements<T>(arr: T[], i: number, j: number): T[] {
  const newArr = [...arr]
  const temp = newArr[i]
  newArr[i] = newArr[j]
  newArr[j] = temp
  return newArr
}

export async function bruteForceTSP(
  points: Point[],
  onProgress: (path: Path) => void,
  delay: number,
  startIndex: number = 0
): Promise<Path> {
  // Ensure startIndex is in bounds
  startIndex = Math.min(Math.max(0, startIndex), points.length - 1)

  // Place starting point first, then generate permutations for the rest
  const startPoint = points[startIndex]
  const remainingPoints = [...points.slice(0, startIndex), ...points.slice(startIndex + 1)]

  const generatePermutations = function* (arr: Point[]): Generator<Point[]> {
    if (arr.length === 1) yield arr
    else {
      for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
        for (const p of generatePermutations(rest)) {
          yield [arr[i], ...p]
        }
      }
    }
  }

  let bestPath: Path = { points: [], distance: Infinity }

  for (const permutation of generatePermutations(remainingPoints)) {
    const fullPermutation = [startPoint, ...permutation]
    const distance = calculateTotalDistance(fullPermutation)
    if (distance < bestPath.distance) {
      bestPath = { points: fullPermutation, distance }
      onProgress(bestPath)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return bestPath
}

export async function nearestNeighborTSP(
  points: Point[],
  onProgress: (path: Path) => void,
  delay: number,
  startIndex: number = 0
): Promise<Path> {
  if (points.length < 2) return { points: [], distance: 0 }

  // Ensure startIndex is in bounds
  startIndex = Math.min(Math.max(0, startIndex), points.length - 1)

  let currentPath: Point[] = [points[startIndex]]
  let remainingPoints = [...points.slice(0, startIndex), ...points.slice(startIndex + 1)]
  let currentPoint = points[startIndex]

  while (remainingPoints.length > 0) {
    let nearestPoint = remainingPoints[0]
    let shortestDistance = calculateDistance(currentPoint, nearestPoint)

    for (const point of remainingPoints) {
      const distance = calculateDistance(currentPoint, point)
      if (distance < shortestDistance) {
        shortestDistance = distance
        nearestPoint = point
      }
    }

    currentPath.push(nearestPoint)
    remainingPoints = remainingPoints.filter(p => p !== nearestPoint)
    currentPoint = nearestPoint

    const path: Path = {
      points: currentPath,
      distance: calculateTotalDistance(currentPath)
    }
    onProgress(path)
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  return {
    points: currentPath,
    distance: calculateTotalDistance(currentPath)
  }
}

export async function simulatedAnnealingTSP(
  points: Point[],
  onProgress: (path: Path) => void,
  delay: number,
  startIndex: number = 0,
  initialTemp: number = 100,
  coolingRate: number = 0.99
): Promise<Path> {
  // Ensure startIndex is in bounds
  startIndex = Math.min(Math.max(0, startIndex), points.length - 1)

  const finalTemp = 0.01
  const iterationsPerTemp = 100

  // Reorder points to start with the selected point
  let currentPath = [
    points[startIndex],
    ...points.slice(0, startIndex),
    ...points.slice(startIndex + 1)
  ]
  let currentDistance = calculateTotalDistance(currentPath)
  let bestPath: Path = {
    points: [...currentPath],
    distance: currentDistance
  }
  let temperature = initialTemp

  while (temperature > finalTemp) {
    for (let i = 0; i < iterationsPerTemp; i++) {
      // Ensure we don't move the starting point
      const i1 = 1 + Math.floor(Math.random() * (points.length - 1))
      const i2 = 1 + Math.floor(Math.random() * (points.length - 1))
      const newPath = swapArrayElements(currentPath, i1, i2)
      const newDistance = calculateTotalDistance(newPath)
      const delta = newDistance - currentDistance

      if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
        currentPath = newPath
        currentDistance = newDistance

        if (currentDistance < bestPath.distance) {
          bestPath = {
            points: [...currentPath],
            distance: currentDistance
          }
          onProgress(bestPath)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    temperature *= coolingRate
  }

  return bestPath
}

export async function christofidesTSP(
  points: Point[],
  onProgress: (path: Path) => void,
  delay: number,
  startIndex: number = 0
): Promise<Path> {
  if (points.length < 2) return { points: [], distance: 0 }

  // Ensure startIndex is in bounds
  startIndex = Math.min(Math.max(0, startIndex), points.length - 1)

  let currentPath: Point[] = [points[startIndex]]
  let remainingPoints = [...points.slice(0, startIndex), ...points.slice(startIndex + 1)]

  while (remainingPoints.length > 0) {
    let bestPoint = remainingPoints[0]
    let bestIncrease = Infinity

    for (const point of remainingPoints) {
      let increase = 0
      if (currentPath.length === 1) {
        increase = calculateDistance(currentPath[0], point)
      } else {
        for (let i = 0; i < currentPath.length; i++) {
          const prev = currentPath[i]
          const next = currentPath[(i + 1) % currentPath.length]
          const oldDist = calculateDistance(prev, next)
          const newDist = calculateDistance(prev, point) + calculateDistance(point, next)
          const localIncrease = newDist - oldDist
          if (localIncrease < increase) {
            increase = localIncrease
          }
        }
      }

      if (increase < bestIncrease) {
        bestIncrease = increase
        bestPoint = point
      }
    }

    let bestPos = 0
    let bestTotal = Infinity

    for (let i = 0; i < currentPath.length; i++) {
      const tempPath = [...currentPath]
      tempPath.splice(i + 1, 0, bestPoint)
      const total = calculateTotalDistance(tempPath)
      if (total < bestTotal) {
        bestTotal = total
        bestPos = i + 1
      }
    }

    currentPath.splice(bestPos, 0, bestPoint)
    remainingPoints = remainingPoints.filter(p => p !== bestPoint)

    const path: Path = {
      points: currentPath,
      distance: calculateTotalDistance(currentPath)
    }
    onProgress(path)
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  return {
    points: currentPath,
    distance: calculateTotalDistance(currentPath)
  }
}

export async function hybridTSP(
  points: Point[],
  onProgress: (path: Path) => void,
  delay: number,
  startIndex: number = 0,
  initialTemp: number = 100,
  coolingRate: number = 0.99
): Promise<Path> {
  // First get a reasonable initial solution using Nearest Neighbor
  const nnSolution = await nearestNeighborTSP(points, onProgress, delay, startIndex)

  // Then improve it using Simulated Annealing with fixed starting point
  const finalTemp = 0.01
  const iterationsPerTemp = 50

  let currentPath = nnSolution.points
  let currentDistance = nnSolution.distance
  let bestPath: Path = {
    points: [...currentPath],
    distance: currentDistance
  }
  let temperature = initialTemp

  while (temperature > finalTemp) {
    for (let i = 0; i < iterationsPerTemp; i++) {
      // Ensure we don't move the starting point
      const i1 = 1 + Math.floor(Math.random() * (points.length - 1))
      const i2 = 1 + Math.floor(Math.random() * (points.length - 1))
      const newPath = swapArrayElements(currentPath, i1, i2)
      const newDistance = calculateTotalDistance(newPath)
      const delta = newDistance - currentDistance

      if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
        currentPath = newPath
        currentDistance = newDistance

        if (currentDistance < bestPath.distance) {
          bestPath = {
            points: [...currentPath],
            distance: currentDistance
          }
          onProgress(bestPath)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    temperature *= coolingRate
  }

  return bestPath
}