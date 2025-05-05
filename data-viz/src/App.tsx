/**
 * Main application entry point that sets up context providers.
 *
 * This file establishes the top-level structure of the application by configuring
 * the provider hierarchy. The application uses two primary context providers:
 * - TimelineProvider: Manages the time-based navigation and data filtering
 * - SelectionProvider: Handles user selection state for eras, providers, and rockets
 *
 * The Layout component is rendered within these providers and handles the overall
 * structure and conditional rendering of the application's main sections.
 *
 * @module App
 */
import Layout from "./components/common/Layout";
import { TimelineProvider } from "./contexts/TimelineContext";
import { SelectionProvider } from "./contexts/SelectionContext";
import "./App.css";

/**
 * Root application component that sets up the provider hierarchy.
 *
 * @returns {JSX.Element} The rendered application with its provider hierarchy
 */
function App() {
  return (
    <TimelineProvider>
      <SelectionProvider>
        <Layout />
      </SelectionProvider>
    </TimelineProvider>
  );
}

export default App;
