import { useState, useEffect } from "react";
import { useScrollSpy } from "../../../hooks/useScrollSpy";

const navItems = [
  { id: "main-viz", label: "Map View" },
  { id: "era-selector", label: "Eras" },
  { id: "provider-selector", label: "Providers" },
  { id: "rocket-selector", label: "Rockets" },
  { id: "rocket-info", label: "Details" },
];

export default function Navigation() {
  const [sectionRefs, setSectionRefs] = useState<
    React.RefObject<HTMLElement>[]
  >([]);
  const activeSection = useScrollSpy(sectionRefs, { threshold: 0.4 });
  const [_, setIsScrolling] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const refs = navItems.map((item) => {
      const element = document.getElementById(item.id);
      return element ? { current: element } : { current: null };
    });

    setSectionRefs(refs as React.RefObject<HTMLElement>[]);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    if (sectionRefs[index]?.current) {
      setIsScrolling(true);
      sectionRefs[index].current?.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isSticky
            ? "bg-background/80 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }
      `}
    >
      <div className="container mx-auto flex justify-center">
        <ul className="flex space-x-2 md:space-x-8 p-1 rounded-full">
          {navItems.map((item, index) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(index)}
                className={`
                  px-3 py-1 rounded-full text-sm transition-all
                  ${
                    activeSection === index
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
