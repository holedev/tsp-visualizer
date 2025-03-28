# TSP Visualizer Project Brief

## Project Overview
The TSP Visualizer is an interactive web application that demonstrates various solutions to the Traveling Salesman Problem (TSP) using different algorithms. Built with Next.js and TypeScript, it provides a visual and educational platform for understanding how different TSP algorithms work and compare with each other.

## Core Requirements

### Functional Requirements
1. Interactive visualization of TSP solutions
2. Support for multiple TSP solving algorithms:
   - Brute Force (optimal for ≤10 points)
   - Nearest Neighbor (greedy approach)
   - Christofides Algorithm
   - Simulated Annealing
   - Hybrid (Nearest Neighbor + Simulated Annealing)
3. Real-time visualization of algorithm progress
4. Customizable parameters:
   - Starting point selection
   - Animation speed control
   - Algorithm-specific parameters (e.g., temperature for simulated annealing)
5. Multiple data input methods:
   - Manual point placement
   - Random point generation
   - Predefined datasets (Vietnam cities)
6. Performance tracking and history

### Technical Requirements
1. Modern web technologies:
   - Next.js with TypeScript
   - React for UI components
   - Canvas for visualization
2. Responsive design
3. Clean architecture separating:
   - Algorithm implementations
   - Data management
   - Visualization
   - UI components
4. Performance optimization for larger datasets
5. Clean, maintainable codebase following best practices

## Project Goals
1. Provide an educational tool for understanding TSP algorithms
2. Demonstrate algorithm performance and trade-offs
3. Offer an intuitive, interactive interface
4. Support both practical use cases and learning scenarios
5. Maintain high performance even with complex algorithms

## Success Criteria
1. Smooth, real-time visualization of algorithm execution
2. Accurate implementation of all TSP algorithms
3. Intuitive user interface requiring minimal instruction
4. Reliable performance across different dataset sizes
5. Comprehensive feature set for both basic and advanced users