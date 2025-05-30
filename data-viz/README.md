# Rocket Launch Data Visualization

An interactive data visualization application that showcases rocket launch data from around the world. Built with modern web technologies, this application provides an engaging way to explore space launch history through interactive maps, charts, and timeline controls.

## Project Overview

This project visualizes **6,860 rocket launches** spanning multiple decades of space exploration history using a variety of interactive components. Users can explore launch trends, success rates, and geographical distribution of space missions.

### Key Features

- **Interactive World Map**: D3.js-powered geospatial visualization
- **Timeline Animation**: Dual-scale timeline (monthly/yearly) with variable speed playback (0.25x-2x)
- **3D Elements**: Three.js Earth globe and astronaut models with scroll-responsive animations
- **Progressive Disclosure**: Era → Provider → Rocket selection system for intuitive data filtering
- **Dynamic Charts**: Real-time launch count and success rate visualizations using D3.js
- **Historical Events**: Twitter-style feed of significant space exploration milestones
- **Responsive Design**: Optimized for desktop and mobile viewing experiences

## Technology Stack

### Core Technologies

- **React 19** - Modern React with concurrent features and improved performance
- **TypeScript** - Type-safe development with enhanced developer experience
- **Vite with SWC** - Fast build tool with Rust-based compiler for optimal performance
- **TailwindCSS v4** - Utility-first CSS framework for rapid UI development

### Visualization Libraries

- **D3.js v7** - Powerful data visualization library for maps and charts
- **Three.js** - 3D graphics library for immersive visual elements
- **React Three Fiber** - React renderer for Three.js with declarative API

### Additional Tools

- **ESLint** - Code linting and quality enforcement
- **TypeDoc** - Documentation generation from TypeScript code
- **Lucide React** - Modern icon library for UI components
- **shadcn/ui** - Component library used for buttons and toggles
- **Material-UI** - Slider component for the timeline

## Architecture

The application follows a feature-based architecture with modular components and centralized state management through React Context.

### Project Structure

The application follows a feature-based architecture with modular components. Below is a high-level overview of the key directories and files (not exhaustive):

```text
src/
├── App.tsx                  # Root component with context providers
├── components/              # Reusable UI components
│   ├── common/              # Layout and navigation components
│   │   ├── Layout/          # Main application layout with progressive disclosure
│   │   └── Navigation/      # Sticky navigation bar with scroll spy functionality
│   └── ui/                  # Interactive UI elements and charts
│       ├── world-map/       # Main D3.js map visualization (modular architecture)
│       │   ├── charts/      # Map overlay charts (launch count, success rate)
│       │   ├── controls/    # Map interaction controls (reset view, map controls)
│       │   ├── panels/      # Information panels (events, statistics)
│       │   ├── statistics/  # Data processing utilities for map statistics
│       │   ├── circle-utils.ts       # D3.js utilities for map circle rendering
│       │   ├── data-utils.ts         # Data transformation utilities
│       │   ├── force-simulation.ts   # D3.js force simulation for circle positioning
│       │   ├── color-constants.ts    # Color schemes and constants
│       │   ├── status-legend.tsx     # Launch status legend overlay
│       │   ├── tooltip-*.ts          # Tooltip content and utilities
│       │   └── types.ts              # TypeScript types for map components
│       ├── animation-controls.tsx    # Timeline playback controls (play/pause/reset)
│       ├── speed-control.tsx         # Animation speed slider and presets (0.25x-2x)
│       ├── timeline-toggle.tsx       # Month/Year view toggle for timeline
│       ├── ProviderBarChart.tsx      # Provider launch count bar chart
│       ├── SuccessFailureDonut.tsx   # Success/failure rate donut chart
│       ├── RocketLaunchLineChart.tsx # Launch count line chart with success gradient
│       ├── button.tsx                # shadcn/ui button component
│       ├── toggle.tsx                # shadcn/ui toggle component
│       ├── toggle-group.tsx          # shadcn/ui toggle group component
│       ├── slider.tsx                # Material-UI based slider component
│       ├── label.tsx                 # shadcn/ui label component
│       └── icons/                    # Custom icon components for rocket specifications
├── features/                # Top-level feature components organized by domain
│   ├── MainViz/             # Primary map visualization with timeline controls
│   ├── Earth3d/             # 3D Earth globe with scroll-responsive animation
│   ├── Astronaut/           # Rotatable 3D astronaut model
│   ├── EraSelector/         # Historical era selection with timeline interface
│   ├── ProviderSelector/    # Launch provider selection with filtering by era
│   ├── RocketSelector/      # Rocket selection with provider-based filtering
│   ├── RocketInfo/          # Detailed rocket information and launch statistics
│   └── Footer/              # Application footer with navigation and data sources
├── contexts/                # React Context providers for global state management
│   ├── TimelineContext.tsx  # Time-based navigation, playback controls, and temporal filtering
│   └── SelectionContext.tsx # Hierarchical selection state (Era → Provider → Rocket)
├── hooks/                   # Custom React hooks for data and UI interactions
│   └── useScrollSpy.ts      # Intersection Observer hook for navigation highlighting
├── lib/                     # Utility functions and data processing logic
│   ├── data-loader.ts       # Data fetching, processing, and filtering utilities
│   └── utils.ts             # General utility functions (date formatting, CSS classes)
└── types/                   # TypeScript type definitions
    └── index.ts             # Type definitions for launches, rockets, providers, eras
```

_Note: This structure shows the main directories and key files. Additional utility files, assets, and configuration files exist throughout the project._

## Getting Started

### Prerequisites

- **Node.js 18+** - Required for modern JavaScript features and package compatibility
- **npm or yarn** - Package manager for dependency installation

### Installation

1. Clone the repository:

```bash
git clone https://github.com/com-480-data-visualization/Fam.git
cd Fam/data-viz
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload and source maps
- `npm run build` - Build production-ready application with optimization
- `npm run lint` - Run ESLint for code quality checks and consistency
- `npm run preview` - Preview production build locally for testing
- `npm run docs` - Generate comprehensive TypeDoc documentation

## License

[MIT License](LICENSE)
