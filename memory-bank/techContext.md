# TSP Visualizer Technical Context

## Technology Stack

### Core Technologies
1. **Frontend Framework**
   - Next.js 15.2.3
   - React 19.0.0
   - TypeScript 5.x

2. **UI Components**
   - Shadcn UI
   - Tailwind CSS 4.x
   - HTML Canvas API

3. **Development Environment**
   - Node.js >= 20.0.0
   - pnpm 10.6.5
   - ESLint 9.x
   - TypeScript compiler

### Project Structure
```
tsp-visualize/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Global styles
├── components/
│   ├── tsp-visualizer.tsx  # Main component
│   └── ui/              # Shadcn components
├── lib/
│   ├── cities-data.ts   # Data management
│   ├── tsp-algorithms.ts # Algorithm implementations
│   └── utils.ts         # Utility functions
└── public/             # Static assets
```

## Development Setup

### Prerequisites
```bash
Node.js >= 20.0.0
pnpm >= 10.6.5
```

### Environment Variables
- No sensitive environment variables required
- Configuration through code constants

### Build System
1. **Development**
   ```bash
   pnpm dev --turbopack
   ```
   - Hot reloading enabled with Turbopack
   - Development server at localhost:3000

2. **Production Build**
   ```bash
   pnpm build
   pnpm start
   ```

## Technical Dependencies

### Core Dependencies
```json
{
  "next": "15.2.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.0.2"
}
```

### UI Framework
```json
{
  "@radix-ui/react-dialog": "^1.1.6",
  "@radix-ui/react-label": "^2.1.2",
  "@radix-ui/react-select": "^2.1.6",
  "@radix-ui/react-slider": "^1.2.3",
  "@radix-ui/react-slot": "^1.1.2",
  "lucide-react": "^0.483.0"
}
```

## Technical Constraints

### Browser Requirements
- Modern browsers with Canvas API support
- JavaScript enabled
- No specific browser dependencies

### Performance Limits
1. **Algorithm Constraints**
   - Brute Force: ≤10 points
   - Other algorithms: ≤100 points
   - Animation speed: 1-100%

2. **Canvas Limitations**
   - Resolution based on viewport
   - Auto-scaling with window resize
   - Coordinate system bounds

### Code Standards
1. **TypeScript Configuration**
   ```json
   {
     "strict": true,
     "target": "ES6",
     "lib": ["dom", "dom.iterable", "esnext"],
     "allowJs": true,
     "skipLibCheck": true,
     "forceConsistentCasingInFileNames": true
   }
   ```

2. **ESLint Rules**
   - Next.js recommended settings
   - TypeScript strict mode
   - React hooks rules

3. **Code Organization**
   - Feature-based structure
   - Shared UI components
   - Utility functions separation
   - Clear type definitions

## Development Workflows

### Component Development
1. Create component file
2. Define TypeScript interfaces
3. Implement component logic
4. Add styling with Tailwind
5. Test functionality

### Algorithm Implementation
1. Define algorithm interface
2. Implement core logic
3. Add progress callbacks
4. Optimize performance
5. Add visualization support

### Testing Approach
- Manual testing for visualization
- Algorithm correctness verification
- Performance benchmarking
- Cross-browser compatibility

## Deployment

### Static Export
```bash
pnpm build
```
- Outputs static files
- No server-side requirements
- Easy deployment to any static host

### Docker Support
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
CMD ["pnpm", "start"]
```

## Monitoring and Maintenance

### Performance Monitoring
- Browser DevTools
- React DevTools
- Frame rate monitoring
- Memory usage tracking

### Error Handling
- Browser console logging
- Algorithm execution tracking
- State consistency checks
- User feedback mechanisms

### Future Considerations
1. Progressive Web App support
2. Additional TSP algorithms
3. Performance optimizations
4. Enhanced visualization options
5. Advanced analytics features