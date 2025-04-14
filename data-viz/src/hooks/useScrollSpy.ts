import { useState, useEffect, RefObject } from "react";

export function useScrollSpy(
  sectionRefs: RefObject<HTMLElement>[],
  options = { threshold: 0.3 }
) {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.findIndex(
              (ref) => ref.current === entry.target
            );
            if (index !== -1) {
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: options.threshold }
    );

    sectionRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sectionRefs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs, options.threshold]);

  return activeSection;
}
