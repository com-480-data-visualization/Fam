import { RefObject } from "react";
import { useSelection } from "../../contexts/SelectionContext";
import { Era } from "../../types";
import { getHistoricalEras } from "../../lib/data-loader";

const mockEras: Era[] = getHistoricalEras();

interface EraSelectorProps {
  providerSectionRef: RefObject<HTMLDivElement | null>;
}

export default function EraSelector({ providerSectionRef }: EraSelectorProps) {
  const { selectedEra, setSelectedEra } = useSelection();

  const handleEraClick = (era: Era) => {
    setSelectedEra(era);

    setTimeout(() => {
      if (providerSectionRef.current) {
        providerSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <section
      id="era-selector"
      className="min-h-screen bg-background text-foreground py-12 px-6"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Choose Your Era</h2>

        <div className="w-full h-32 bg-card rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center h-full">
            {mockEras.map((era) => (
              <div
                key={era.id}
                onClick={() => handleEraClick(era)}
                className={`
                  h-full flex flex-col justify-between items-center cursor-pointer px-4
                  ${
                    selectedEra?.id === era.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                `}
              >
                <span className="text-sm font-semibold">{era.name}</span>
                <div className="w-3 h-3 rounded-full bg-current"></div>
                <span className="text-xs">
                  {era.startDate}-{era.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {selectedEra && (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{selectedEra.name}</h3>
            <p className="text-muted-foreground mb-2">
              {selectedEra.startDate} - {selectedEra.endDate}
            </p>
            <p>{selectedEra.description}</p>
          </div>
        )}
      </div>
    </section>
  );
}
