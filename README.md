# TSP Visualizer

A modern, interactive visualization tool for the Traveling Salesman Problem (TSP) implementing multiple solving algorithms with real-time visualization.

## Features

- 🎯 **Multiple TSP Algorithms**
  - Brute Force (optimal for ≤10 points)
  - Nearest Neighbor (greedy approach)
  - Christofides Algorithm
  - Simulated Annealing
  - Hybrid (Nearest Neighbor + Simulated Annealing)

- 🎨 **Interactive Visualization**
  - Real-time algorithm execution
  - Canvas-based rendering
  - Adjustable animation speed
  - Point coordinate display

- 🔧 **Flexible Input Methods**
  - Click-to-place points
  - Random point generation
  - Vietnam cities dataset
  - Custom starting point selection

- 📊 **Performance Tracking**
  - Execution time measurement
  - Path distance calculation
  - Historical run comparisons
  - Algorithm performance stats

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.6.5

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tsp-visualize.git

# Navigate to project directory
cd tsp-visualize

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with Turbopack
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Production Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Usage

1. **Adding Points**
   - Click on the canvas to place points manually
   - Use "Generate" to create random points
   - Click "Load Example" for Vietnam cities dataset

2. **Selecting Algorithm**
   - Choose algorithm from dropdown
   - Adjust algorithm-specific parameters if available
   - Select starting point (optional)

3. **Running Visualization**
   - Adjust animation speed if desired
   - Click "Start" to begin visualization
   - Watch real-time progress
   - View statistics in right panel

4. **Comparing Algorithms**
   - Switch to "Compare All" mode
   - Run all algorithms simultaneously
   - Compare performance metrics
   - View color-coded results

## Technical Stack

- Next.js 15.2.3
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 4.x
- Shadcn UI (via Radix UI)
  - @radix-ui/react-dialog 1.1.6
  - @radix-ui/react-label 2.1.2
  - @radix-ui/react-select 2.1.6
  - @radix-ui/react-slider 1.2.3
  - @radix-ui/react-slot 1.1.2

## Project Structure

```
tsp-visualize/
├── app/                 # Next.js app directory
├── components/         # React components
│   ├── ui/            # Shadcn UI components
│   └── tsp-visualizer # Main visualization component
├── lib/               # Core logic
│   ├── cities-data    # Geographic data
│   ├── tsp-algorithms # Algorithm implementations
│   └── utils          # Utility functions
└── public/            # Static assets
```

## Algorithm Details

### Brute Force
- Finds optimal solution
- Limited to 10 points
- Comprehensive path exploration

### Nearest Neighbor
- Greedy approach
- Fast execution
- Good for large datasets
- Sub-optimal solutions

### Christofides
- Approximation algorithm
- Guaranteed performance ratio
- Balanced approach

### Simulated Annealing
- Metaheuristic approach
- Customizable parameters
- Escapes local optima

### Hybrid
- Combines Nearest Neighbor and Simulated Annealing
- Better initial solutions
- Refined optimization

## Performance Notes

- Brute Force limited to 10 points
- Other algorithms support up to 100 points
- Animation speed adjustable (1-100%)
- Real-time visualization may affect performance
- Consider reducing animation speed for large datasets

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Algorithm implementations based on classical TSP solutions
- Vietnam cities dataset included for real-world example
- UI components from Shadcn UI (v0.7.1)
