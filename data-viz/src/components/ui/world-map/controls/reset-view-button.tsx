/**
 * Reset view button overlay component for the world map visualization.
 * Provides a non-intrusive button to reset the map view.
 *
 * @module components/ui/world-map/overlays/reset-view-button
 */

interface ResetViewButtonProps {
  onResetView: () => void;
}

/**
 * Component that renders a reset view button overlay on the map.
 *
 * @param {ResetViewButtonProps} props - Component props
 * @returns {JSX.Element} Reset view button component
 */
export function ResetViewButton({ onResetView }: ResetViewButtonProps) {
  return (
    <button
      onClick={onResetView}
      className="px-3 py-2 rounded-md text-xs bg-background/70 backdrop-blur-sm text-foreground border border-border hover:bg-muted/50 transition-colors shadow-md"
      title="Reset map view"
    >
      Reset View
    </button>
  );
}
