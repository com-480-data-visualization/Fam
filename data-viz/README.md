# Rocket Launch Data Visualization

A comprehensive interactive data visualization application for exploring global rocket launch data throughout spaceflight history. This application enables users to analyze historical trends in space exploration through an interactive world map and hierarchical filtering system.

## Technical Overview

This application is built on React with TypeScript, utilizing D3.js for data visualization components and modern React patterns for state management. The visualization focuses on presenting historical rocket launch data with multiple layers of interactivity.

### Core Technologies

- **Frontend Framework**: React 19 with TypeScript
- **Data Visualization**: D3.js
- **State Management**: React Context API
- **Styling**: TailwindCSS
- **Build System**: Vite
- **Documentation**: TypeDoc

## Architecture

The application follows a feature-based architecture with clear separation of concerns:

### Key Architectural Components

- **Context Providers**

  - `TimelineContext`: Manages time-series data and playback controls
  - `SelectionContext`: Handles user selection state across component hierarchy

- **Component Categories**

  - `components/ui`: Reusable UI primitives and visualization elements
  - `components/common`: Shared structural components
  - `features`: Feature-specific components organized by domain

- **Data Flow**
  - Data is loaded asynchronously from JSON source files
  - Context providers distribute data to components based on user interaction
  - Interactive elements generate events that update context state

## Project Structure

```yaml
src/
├── App.tsx                 # Application entry point
├── components/             # Reusable UI components
│   ├── common/             # Layout and navigation components
│   └── ui/                 # UI elements and visualizations
│       └── world-map/      # Modular components for the world map visualization
│           ├── charts/     # Chart visualization components
│           ├── controls/   # UI control components
│           ├── panels/     # Information panel components
│           └── statistics/ # Data processing utilities
├── contexts/               # React context providers
├── features/               # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and data processing
└── types/                  # TypeScript type definitions
```

## Key Features

### Interactive World Map Visualization

- Geographic representation of launch sites
- Color-coded status indicators
- Interactive tooltips with detailed launch information
- Time-based animation
- Modular component architecture for maintainability

### Multi-level Data Exploration

- Historical era selection
- Launch provider filtering
- Rocket type selection
- Detailed rocket specifications

### Responsive Time Navigation

- Timeline slider with playback controls
- Month/year precision
- Variable playback speed

## Development Setup

### Prerequisites

- Node.js
- npm

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd data-viz

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Generate documentation
npm run docs

# Serve documentation
npm run docs:serve
```

## Documentation

The codebase is fully documented using JSDoc-style comments and TypeDoc for documentation generation. The documentation covers:

- Component APIs
- Type interfaces
- Context usage patterns
- Utility functions

To view the documentation, run `npm run docs:serve` and open the displayed local URL in your browser.

## Performance Considerations

The application implements several optimization strategies:

- Virtualized rendering for large datasets
- Memoization of expensive calculations
- Efficient D3.js integration with React lifecycle
- Conditional rendering based on viewport visibility
- Modular component architecture to prevent unnecessary re-renders

## License

[MIT License](LICENSE)
