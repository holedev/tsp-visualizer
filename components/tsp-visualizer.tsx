'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { vietnamCities, getCanvasCoordinates } from '@/lib/cities-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Point } from '@/lib/cities-data';
import {
  type Path,
  type AlgorithmType,
  bruteForceTSP,
  nearestNeighborTSP,
  christofidesTSP,
  simulatedAnnealingTSP,
  hybridTSP,
} from '@/lib/tsp-algorithms';

const algorithms = [
  { id: 'bruteforce', name: 'Brute Force (≤10 points)', fn: bruteForceTSP },
  {
    id: 'nearest-neighbor',
    name: 'Greedy (Nearest Neighbor)',
    fn: nearestNeighborTSP,
  },
  { id: 'christofides', name: 'Christofides', fn: christofidesTSP },
  {
    id: 'simulated-annealing',
    name: 'Simulated Annealing',
    fn: simulatedAnnealingTSP,
  },
  { id: 'hybrid', name: 'Greedy + Simulated Annealing', fn: hybridTSP },
] as const;

type VisualizationMode = 'single' | 'compare';

interface AlgorithmResult {
  algorithm: string;
  time: number;
  path: Path;
}

interface HistoryEntry {
  algorithm: string;
  time: number;
  points: number;
  distance: number;
  timestamp: number;
  datetime: string;
}

const PADDING = 50;
const CONTROL_PANEL_WIDTH = 300;
const LOCALSTORAGE_KEY = 'tsp-history';

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

function formatTime(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
}

export default function TspVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [bestPath, setBestPath] = useState<Path | null>(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmType>('nearest-neighbor');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(
    null
  );
  const [randomQuantity, setRandomQuantity] = useState<number>(5);
  const [initialTemp, setInitialTemp] = useState<number>(100);
  const [coolingRate, setCoolingRate] = useState<number>(0.99);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [visualizationMode, setVisualizationMode] =
    useState<VisualizationMode>('single');
  const [compareResults, setCompareResults] = useState<AlgorithmResult[]>([]);
  const [startPoint, setStartPoint] = useState<number>(0);
  const latestPathRef = useRef<Path | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(LOCALSTORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  // Canvas setup and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth - CONTROL_PANEL_WIDTH - 48;
      canvas.height = window.innerHeight - 48;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw points
      points.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = hoveredPointIndex === i ? '#0066cc' : '#000';
        ctx.fill();
        ctx.closePath();

        // Draw text
        const displayText = point.name || `Point ${i + 1}`;
        let tooltipText = displayText;
        if (showCoordinates && point.lat && point.lng) {
          tooltipText += ` (${point.lat.toFixed(4)}°, ${point.lng.toFixed(
            4
          )}°)`;
        }

        ctx.font = '12px Arial';
        ctx.fillStyle = hoveredPointIndex === i ? '#0066cc' : '#000';
        ctx.fillText(tooltipText, point.x + 10, point.y + 10);
      });

      // Draw paths based on visualization mode
      if (
        visualizationMode === 'single' &&
        bestPath &&
        bestPath.points.length > 0
      ) {
        ctx.beginPath();
        ctx.moveTo(bestPath.points[0].x, bestPath.points[0].y);
        bestPath.points.forEach((point: Point) => {
          ctx.lineTo(point.x, point.y);
        });
        if (bestPath.points.length > 2) {
          ctx.lineTo(bestPath.points[0].x, bestPath.points[0].y);
        }
        ctx.strokeStyle = '#0066cc';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
      } else if (visualizationMode === 'compare' && compareResults.length > 0) {
        const colors = ['#0066cc', '#cc0066', '#66cc00', '#cc6600', '#6600cc'];
        compareResults.forEach((result, index) => {
          if (result.path.points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(result.path.points[0].x, result.path.points[0].y);
            result.path.points.forEach((point: Point) => {
              ctx.lineTo(point.x, point.y);
            });
            if (result.path.points.length > 2) {
              ctx.lineTo(result.path.points[0].x, result.path.points[0].y);
            }
            ctx.strokeStyle = colors[index % colors.length];
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
          }
        });
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [points, bestPath, hoveredPointIndex, compareResults, visualizationMode, showCoordinates]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints([...points, { x, y }]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoverIndex = points.findIndex((point) => {
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
      );
      return distance < 10;
    });

    setHoveredPointIndex(hoverIndex >= 0 ? hoverIndex : null);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredPointIndex(null);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setRandomQuantity(Math.min(Math.max(0, value), 100));
  };

  const handleRandomPoints = () => {
    if (isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const quantity = Math.min(Math.max(1, randomQuantity), 100);
    const newPoints: Point[] = [];

    for (let i = 0; i < quantity; i++) {
      const x = Math.random() * (canvas.width - 2 * PADDING) + PADDING;
      const y = Math.random() * (canvas.height - 2 * PADDING) + PADDING;
      const point: Point = {
        x,
        y,
        name: `Point ${i + 1}`,
        lat: y / canvas.height * 180 - 90, // Convert y to latitude (-90 to 90)
        lng: x / canvas.width * 360 - 180,  // Convert x to longitude (-180 to 180)
      };
      newPoints.push(point);
    }

    setPoints(newPoints);
    setBestPath(null);
    setExecutionTime(null);
    setStartPoint(0);
  };

  const handleClear = () => {
    setPoints([]);
    setBestPath(null);
    setIsRunning(false);
    setExecutionTime(null);
    setCompareResults([]);
    setStartPoint(0);
  };

  const handleStart = async () => {
    if (points.length < 2) return;
    if (
      visualizationMode === 'single' &&
      selectedAlgorithm === 'bruteforce' &&
      points.length > 10
    ) {
      alert('Brute force algorithm is limited to 10 points or less');
      return;
    }

    setIsRunning(true);
    setExecutionTime(null);
    setCompareResults([]);

    try {
      if (visualizationMode === 'single') {
        const algorithm = algorithms.find((a) => a.id === selectedAlgorithm);
        if (algorithm) {
          const startTime = performance.now();
          const delay = 1000 - animationSpeed * 9;

          const updatePath = (path: Path) => {
            latestPathRef.current = path;
            setBestPath(path);
          };

          const pointsCopy = points.map((p) => ({ ...p }));
          if (
            algorithm.id === 'simulated-annealing' ||
            algorithm.id === 'hybrid'
          ) {
            await algorithm.fn(
              pointsCopy,
              updatePath,
              delay,
              startPoint,
              initialTemp,
              coolingRate
            );
          } else {
            await algorithm.fn(pointsCopy, updatePath, delay, startPoint);
          }
          const endTime = performance.now();
          const time = endTime - startTime;
          setExecutionTime(time);

          if (latestPathRef.current) {
            const timestamp = Date.now();
            const newEntry: HistoryEntry = {
              algorithm: algorithm.name,
              time,
              points: points.length,
              distance: latestPathRef.current.distance,
              timestamp,
              datetime: formatDateTime(timestamp),
            };
            setHistory((prev) => [newEntry, ...prev].slice(0, 10));
          }
        }
      } else {
        // Compare mode - run all algorithms except bruteforce for large datasets
        const applicableAlgorithms =
          points.length > 10
            ? algorithms.filter((a) => a.id !== 'bruteforce')
            : algorithms;

        const results: AlgorithmResult[] = [];
        for (const algorithm of applicableAlgorithms) {
          const startTime = performance.now();
          const delay = Math.min(100, 1000 - animationSpeed * 9); // Faster animations in compare mode

          let lastPath: Path | null = null;
          const updatePath = (path: Path) => {
            lastPath = path;
            results.forEach((result, index) => {
              if (result.algorithm === algorithm.name) {
                results[index] = { ...result, path };
              }
            });
            setCompareResults([...results]);
          };

          const pointsCopy = points.map((p) => ({ ...p }));
          if (
            algorithm.id === 'simulated-annealing' ||
            algorithm.id === 'hybrid'
          ) {
            await algorithm.fn(
              pointsCopy,
              updatePath,
              delay,
              startPoint,
              initialTemp,
              coolingRate
            );
          } else {
            await algorithm.fn(pointsCopy, updatePath, delay, startPoint);
          }
          const endTime = performance.now();

          if (lastPath) {
            results.push({
              algorithm: algorithm.name,
              time: endTime - startTime,
              path: lastPath,
            });
            setCompareResults([...results]);
          }
        }

        // Add best result to history
        const bestResult = results.reduce((best, current) =>
          current.path.distance < best.path.distance ? current : best
        );

        const timestamp = Date.now();
        const newEntry: HistoryEntry = {
          algorithm: `Compare (Best: ${bestResult.algorithm})`,
          time: results.reduce((sum, r) => sum + r.time, 0),
          points: points.length,
          distance: bestResult.path.distance,
          timestamp,
          datetime: formatDateTime(timestamp),
        };
        setHistory((prev) => [newEntry, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('Algorithm error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Options Bar */}
      <div className="p-4 bg-white border-b">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label>Mode</Label>
            <Select
              value={visualizationMode}
              onValueChange={(value: VisualizationMode) => {
                setVisualizationMode(value);
                setCompareResults([]);
              }}
              disabled={isRunning}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Algorithm</SelectItem>
                <SelectItem value="compare">Compare All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={visualizationMode === 'single' ? 'block' : 'hidden'}>
            <Label>Algorithm</Label>
            <Select
              value={selectedAlgorithm}
              onValueChange={(value: AlgorithmType) =>
                setSelectedAlgorithm(value)
              }
              disabled={isRunning}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {algorithms.map((algo) => (
                  <SelectItem key={algo.id} value={algo.id}>
                    {algo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(selectedAlgorithm === 'simulated-annealing' ||
            selectedAlgorithm === 'hybrid') &&
            visualizationMode === 'single' && (
              <div className="flex gap-4">
                <div>
                  <Label>Initial Temperature</Label>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    value={initialTemp}
                    onChange={(e) => setInitialTemp(Number(e.target.value))}
                    className="w-24"
                    disabled={isRunning}
                  />
                </div>
                <div>
                  <Label>Cooling Rate</Label>
                  <Input
                    type="number"
                    min={0.01}
                    max={0.99999}
                    step={0.01}
                    value={coolingRate}
                    onChange={(e) => setCoolingRate(Number(e.target.value))}
                    className="w-24"
                    disabled={isRunning}
                  />
                </div>
              </div>
            )}

          <div>
            <Label>Data Points</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                max={1000}
                value={randomQuantity}
                onChange={handleQuantityChange}
                className="w-20"
                disabled={isRunning}
                placeholder="Count"
              />
              <Button
                onClick={handleRandomPoints}
                disabled={isRunning}
                variant="outline"
              >
                Generate
              </Button>
              <Button
                onClick={() => setShowCoordinates(!showCoordinates)}
                disabled={isRunning}
                variant="outline"
                title="Toggle coordinate display"
              >
                {showCoordinates ? 'Hide Coords' : 'Show Coords'}
              </Button>
              <Button
                onClick={() => {
                  if (isRunning) return;
                  const canvas = canvasRef.current;
                  if (!canvas) return;

                  const newPoints = vietnamCities.map((city) => {
                    return getCanvasCoordinates(
                      city,
                      canvas.width,
                      canvas.height
                    );
                  });
                  setPoints(newPoints);
                  setBestPath(null);
                  setExecutionTime(null);
                  setCompareResults([]);
                  setStartPoint(0);
                }}
                disabled={isRunning}
                variant="outline"
                title="Load Vietnam Cities"
              >
                Load Example
              </Button>
            </div>
          </div>

          <div>
            <Label>Starting Point</Label>
            <Select
              value={startPoint.toString()}
              onValueChange={(value) => setStartPoint(parseInt(value))}
              disabled={isRunning || points.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select starting point" />
              </SelectTrigger>
              <SelectContent>
                {points.map((point, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {point.name || `Point ${index + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleStart}
              disabled={isRunning || points.length < 2}
              className="w-32"
            >
              {isRunning ? 'Running...' : 'Start'}
            </Button>
            <Button
              onClick={handleClear}
              disabled={isRunning}
              variant="outline"
            >
              Clear
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Label>Speed</Label>
            <input
              type="range"
              min={1}
              max={100}
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
            />
            <span className="text-sm text-gray-500 w-12">
              {animationSpeed}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-4 gap-4 min-h-0">
        <Card className="flex-1">
          <CardContent className="h-full p-4">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={handleCanvasMouseLeave}
              className="w-full h-full border border-gray-200 rounded-lg cursor-crosshair bg-white"
            />
          </CardContent>
        </Card>

        {/* Right Panel */}
        <div
          style={{ width: CONTROL_PANEL_WIDTH }}
          className="flex flex-col gap-4"
        >
          {/* Statistics Card */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Points:</span>
                    <span className="font-medium">{points.length}</span>
                  </div>
                  {points.length > 0 && (
                    <div className="flex justify-between">
                      <span>Start Point:</span>
                      <span className="font-medium">
                        {points[startPoint]?.name || `Point ${startPoint + 1}`}
                      </span>
                    </div>
                  )}
                </div>

                {visualizationMode === 'single' ? (
                  <>
                    {bestPath && (
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">
                          {Math.round(bestPath.distance)}
                        </span>
                      </div>
                    )}
                    {executionTime !== null && (
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">
                          {formatTime(executionTime)}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    {compareResults.map((result, index) => (
                      <div
                        key={result.algorithm}
                        className="border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {result.algorithm}
                          </span>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: [
                                '#0066cc',
                                '#cc0066',
                                '#66cc00',
                                '#cc6600',
                                '#6600cc',
                              ][index % 5],
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            Distance: {Math.round(result.path.distance)}
                          </span>
                          <span>{formatTime(result.time)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* History Card */}
          {history.length > 0 && (
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">History</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem(LOCALSTORAGE_KEY);
                    }}
                  >
                    Clear History
                  </Button>
                </div>
                <div className="space-y-2 min-h-0 overflow-auto max-h-[300px]">
                  {history.map((entry) => (
                    <div
                      key={entry.timestamp}
                      className="group flex flex-col gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted/50"
                      title={`Run at: ${entry.datetime}`}
                    >
                      <div className="flex justify-between items-start">
                        <span
                          className="truncate font-medium flex-1"
                          title={entry.algorithm}
                        >
                          {entry.algorithm}
                        </span>
                        <span className="ml-2 text-right font-medium">
                          {formatTime(entry.time)}
                        </span>
                      </div>
                      <div className="text-xs">
                        Points: {entry.points} • Distance:{' '}
                        {Math.round(entry.distance)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
