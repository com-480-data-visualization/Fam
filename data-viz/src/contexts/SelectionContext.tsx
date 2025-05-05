/**
 * Selection Context for managing user selection state.
 *
 * This context provides functionality for tracking and updating user selections
 * throughout the application, including:
 * - Selected historical era
 * - Selected launch provider
 * - Selected rocket
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
  /** Updates the selected era */
  setSelectedEra: (era: Era | null) => void;
  /** Updates the selected provider */
  setSelectedProvider: (provider: Provider | null) => void;
  /** Updates the selected rocket */
  setSelectedRocket: (rocket: Rocket | null) => void;
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
 * - Finally selects a Rocket (available rockets depend on the selected provider)
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

  return (
    <SelectionContext.Provider
      value={{
        selectedEra,
        selectedProvider,
        selectedRocket,
        setSelectedEra,
        setSelectedProvider,
        setSelectedRocket,
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
