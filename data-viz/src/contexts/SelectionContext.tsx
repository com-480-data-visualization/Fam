import { createContext, useContext, useState, ReactNode } from "react";
import { Era, Provider, Rocket } from "../types";

interface SelectionContextType {
  selectedEra: Era | null;
  selectedProvider: Provider | null;
  selectedRocket: Rocket | null;
  setSelectedEra: (era: Era | null) => void;
  setSelectedProvider: (provider: Provider | null) => void;
  setSelectedRocket: (rocket: Rocket | null) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

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

export function useSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
