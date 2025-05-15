/**
 * Selection Context for managing user selection state.
 *
 * This context provides functionality for tracking and updating user selections
 * throughout the application, including:
 * - Selected historical era
 * - Selected launch provider
 * - Selected rocket
 * - Flag to toggle rocket selection UI
 *
 * @module contexts/SelectionContext
 */
import { createContext, ReactNode, useContext, useState } from "react";
import { Era, Provider, Rocket } from "../types";

/**
 * Interface defining available properties and methods in the SelectionContext.
 *
 * @interface SelectionContextType
 */
interface SelectionContextType {
  /** Currently selected historical era, or null if none selected */
  selectedEra: Era | null;
  /** Currently selected launch provider, or null if none selected */
  selectedProvider: Provider | null;
  /** Currently selected rocket, or null if none selected */
  selectedRocket: Rocket | null;
  /** Whether to show the Rocket Selector or skip to Rocket Info */
  showRocketSelector: boolean;
  /** Updates the selected era */
  setSelectedEra: (era: Era | null) => void;
  /** Updates the selected provider */
  setSelectedProvider: (provider: Provider | null) => void;
  /** Updates the selected rocket */
  setSelectedRocket: (rocket: Rocket | null) => void;
  /** Toggles whether the Rocket Selector UI is shown */
  setShowRocketSelector: (show: boolean) => void;
}

/**
 * React Context for selection state
 */
const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

/**
 * Provider component for the SelectionContext.
 *
 * The selection follows a hierarchical pattern:
 * - User first selects an Era
 * - Then selects a Provider (available providers depend on the selected era)
 * - Then either selects a Rocket or views info directly
 *
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to the context
 * @returns {JSX.Element} The provider component
 */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [selectedRocket, setSelectedRocket] = useState<Rocket | null>(null);
  const [showRocketSelector, setShowRocketSelector] = useState<boolean>(false);

  return (
    <SelectionContext.Provider
      value={{
        selectedEra,
        selectedProvider,
        selectedRocket,
        showRocketSelector,
        setSelectedEra,
        setSelectedProvider,
        setSelectedRocket,
        setShowRocketSelector,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

/**
 * Custom hook for accessing the SelectionContext.
 *
 * @example
 * ```tsx
 * const { selectedEra, setSelectedProvider } = useSelection();
 * ```
 *
 * @returns {SelectionContextType} The selection context value
 * @throws {Error} If used outside of a SelectionProvider
 */
export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
