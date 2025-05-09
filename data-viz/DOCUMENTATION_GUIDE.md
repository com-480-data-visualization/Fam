c# Documentation Guide

This document provides guidance on understanding and navigating the documentation for the Rocket Launch Data Visualization project.

## Documentation Structure

The documentation is organized into the following sections:

- **App**: Main application entry point and structure
- **Components**: Reusable UI components
  - **Common**: Layout and navigation components
  - **UI**: UI elements and visualizations
    - **World Map**: Modular components for the world map visualization
      - **Charts**: Chart visualization components
      - **Controls**: UI control components
      - **Panels**: Information panel components
      - **Statistics**: Data processing utilities
- **Features**: Feature-specific components
- **Contexts**: React context providers
- **Hooks**: Custom React hooks
- **Utils**: Utility functions and data processing
- **Types**: TypeScript type definitions

## Generating Documentation

To generate or update the documentation, run:

```bash
npm run docs
```

To view the documentation in a browser, run:

```bash
npm run docs:serve
```

Then open your browser to the displayed URL (typically <http://localhost:3000>).

## Key Components

Some key components to understand when working with this codebase:

### Contexts

- [**TimelineContext**](/docs/modules/contexts_TimelineContext.html): Manages time-related state including the current time period, playback controls, and filtering data based on time.
- [**SelectionContext**](/docs/modules/contexts_SelectionContext.html): Manages user selection state for eras, providers, and rockets.

### Components

- [**WorldMap**](/docs/modules/components_ui_world_map.html): The main visualization component that orchestrates the display of launch sites and related data.
  - [**MapVisualization**](/docs/functions/components_ui_world-map_map-visualization.MapVisualization.html): Handles the core map rendering and D3.js integration.
  - [**StatusPanel**](/docs/functions/components_ui_world-map_panels_status-panel.StatusPanel.html): Displays launch status information and statistics.
  - [**EventsPanel**](/docs/functions/components_ui_world-map_panels_events-panel.EventsPanel.html): Shows historical space events in a timeline.
  - [**LaunchCountChart**](/docs/functions/components_ui_world-map_charts_launch-count-chart.LaunchCountChart.html): Visualizes launch counts over time.
  - [**SuccessRateChart**](/docs/functions/components_ui_world-map_charts_success-rate-chart.SuccessRateChart.html): Displays success rates of launches over time.
- [**Layout**](/docs/modules/components_common_Layout.html): Handles the overall structure and conditional rendering of the application's sections.

### Data

- [**data-loader.ts**](/docs/modules/lib_data_loader.html): Contains functions for loading and processing rocket launch data.
- [**yearly-launch-data.ts**](/docs/modules/components_ui_world-map_statistics_yearly-launch-data.html): Processes launch data into yearly statistics.

## Code Documentation Standards

We follow these documentation practices:

1. **File Headers**: Each file should have a JSDoc comment at the top describing its purpose
2. **Component Documentation**: React components should have JSDoc comments describing:
   - What the component does
   - Important props
   - Return values
3. **Function Documentation**: Functions should be documented with:
   - Purpose
   - Parameters
   - Return values
   - Examples for complex functions
4. **Interface/Type Documentation**: Each interface and important type should have a description

## Common Patterns

### Context Usage

Components access global state through context hooks:

```tsx
// Access timeline data and controls
const { currentYear, isPlaying, togglePlayback } = useTimeline();

// Access selection state
const { selectedEra, setSelectedProvider } = useSelection();
```

### Progressive Disclosure Pattern

The application uses a progressive disclosure pattern where deeper levels of detail are shown only after selections are made:

1. Main visualization is always shown
2. Era selector is always shown
3. Provider selector is shown only when an era is selected
4. Rocket selector is shown only when a provider is selected
5. Rocket info is shown only when a rocket is selected

### Component Modularity Pattern

The WorldMap visualization follows a modular component structure:

1. Main `WorldMap` component orchestrates the overall visualization
2. `MapVisualization` handles core D3.js map rendering
3. Specialized panel components manage different UI sections
4. Chart components handle data visualization
5. Utility functions in separate modules handle data processing

This separation allows for better maintainability and performance optimization.

## Performance Optimization Patterns

Several patterns are used to optimize performance:

1. **Memoization**: Using `useMemo` for expensive calculations
2. **Proper dependency arrays**: Ensuring React hooks only run when necessary
3. **Component separation**: Breaking large components into smaller, focused ones
4. **Conditional rendering**: Only rendering components when they need to be visible
