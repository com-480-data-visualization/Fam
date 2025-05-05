/**
 * Custom React hook for tracking scroll position relative to sections.
 *
 * This hook implements a "scroll spy" functionality that tracks which section of the
 * page is currently most visible in the viewport. It's primarily used for highlighting
 * the correct navigation item as the user scrolls through different sections of the page.
 *
 * @module hooks/useScrollSpy
 */
import { useState, useEffect, RefObject } from "react";

/**
 * Hook that tracks which section is most visible in the viewport.
 *
 * @param {RefObject<HTMLElement>[]} sectionRefs - Array of refs to sections to track
 * @param {object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1) that determines how
 *                                    much of a section must be visible to be considered "active"
 * @returns {number|null} Index of the currently active section in the sectionRefs array, or null if none
 *
 * @example
 * ```tsx
 * const sections = [useRef(null), useRef(null), useRef(null)];
 * const activeSection = useScrollSpy(sections, { threshold: 0.4 });
 *
 * // activeSection will update as the user scrolls through the page
 * // Value will be 0, 1, 2, or null depending on which section is most visible
 * ```
 */
export function useScrollSpy(
  sectionRefs: RefObject<HTMLElement>[],
  options = { threshold: 0.3 }
) {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    // Use IntersectionObserver API to efficiently track scroll position
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

    // Observe all sections
    sectionRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Cleanup: stop observing when component unmounts
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
