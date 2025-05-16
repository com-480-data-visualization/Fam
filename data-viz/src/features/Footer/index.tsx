/**
 * Footer component for the Rocket Launch Data Visualization application.
 * Provides navigation links, application information, and data source references.
 *
 * @module features/Footer
 */

import { useSelection } from "../../contexts/SelectionContext";

/**
 * Footer component with contextual navigation based on the user's current selection state.
 * Includes smooth scrolling navigation to different sections of the application,
 * copyright information, and data source references.
 *
 * @returns JSX element containing the application footer
 */
export default function Footer() {
  const { selectedEra, selectedProvider, selectedRocket } = useSelection();

  /**
   * Scrolls the viewport smoothly to the specified section.
   *
   * @param id - The HTML element ID to scroll to
   */
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
              <li><a href="https://spacelaunchnow.me/" className="no-underline text-inherit">Space Launch Now Dataset</a></li>
              <li><a href="http://www.astronautix.com/" className="no-underline text-inherit">Astronautix</a></li>
              <li><a href="https://www.ulalaunch.com/" className="no-underline text-inherit">ULA Launch</a></li>
              <li><a href="https://en.wikipedia.org/" className="no-underline text-inherit">Wikipédia</a></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Last updated: May 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
