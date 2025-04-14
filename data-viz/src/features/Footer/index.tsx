import { useSelection } from "../../contexts/SelectionContext";

export default function Footer() {
  const { selectedEra, selectedProvider, selectedRocket } = useSelection();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card text-foreground py-10 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Rocket Launch Data Viz</h3>
            <p className="text-muted-foreground mb-4">
              An interactive visualization of global rocket launches throughout
              history, exploring the evolution of space exploration.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Rocket Launch Data Visualization
              Project
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("main-viz")}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Main Visualization
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("era-selector")}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Historical Eras
                  </button>
                </li>
                {selectedEra && (
                  <li>
                    <button
                      onClick={() => scrollToSection("provider-selector")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Launch Providers
                    </button>
                  </li>
                )}
                {selectedProvider && (
                  <li>
                    <button
                      onClick={() => scrollToSection("rocket-selector")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Rockets
                    </button>
                  </li>
                )}
                {selectedRocket && (
                  <li>
                    <button
                      onClick={() => scrollToSection("rocket-info")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Rocket Details
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Space Launch Dataset (Placeholder)</li>
              <li>NASA Open Data Portal</li>
              <li>European Space Agency Archives</li>
              <li>Space Launch Report Database</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Last updated: April 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
