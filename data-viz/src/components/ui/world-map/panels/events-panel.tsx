/**
 * Events panel component for the world map visualization.
 * Displays a list of historical space events as a Twitter-like feed.
 *
 * @module components/ui/world-map/panels/events-panel
 */

import { SpaceTweet } from "../types";

interface EventsPanelProps {
  showSpaceEvents: boolean;
  setShowSpaceEvents: (value: boolean) => void;
  visibleTweets: SpaceTweet[];
  currentYear: number;
}

/**
 * Component that renders a collapsible panel with historical space events in a Twitter-like feed.
 *
 * @param {EventsPanelProps} props - Component props
 * @returns {JSX.Element} Events panel component
 */
export function EventsPanel({
  showSpaceEvents,
  setShowSpaceEvents,
  visibleTweets,
  currentYear,
}: EventsPanelProps) {
  return (
    <div className="w-full lg:w-64 pb-2">
      <div className="bg-background/70 backdrop-blur-sm rounded-md shadow-md border border-border">
        {/* Panel header */}
        <div className="p-3 border-b border-muted/40">
          <button
            onClick={() => setShowSpaceEvents(!showSpaceEvents)}
            className="w-full flex justify-between items-center text-left"
          >
            <span className="text-sm font-medium">Space Events</span>
            <span
              className={`text-xs transition-transform duration-200 ${
                showSpaceEvents ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        </div>

        {/* Panel content */}
        {showSpaceEvents && (
          <div
            id="tweet-container"
            className="overflow-y-auto p-3 lg:h-48 h-64 lg:h-80 space-y-2 tweet-scroll"
          >
            {visibleTweets.length > 0 ? (
              visibleTweets.map((tweet) => (
                <div
                  key={`${tweet.year}-${tweet.id}`}
                  className={`p-2 rounded bg-muted/60 text-xs tweet-item text-left ${
                    tweet.year === currentYear
                      ? "animate-pulse-once border-l-2 border-primary pl-2 -ml-2"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{tweet.author}</span>
                    <span className="text-muted-foreground">{tweet.year}</span>
                  </div>
                  <p className="text-left">{tweet.content}</p>
                </div>
              ))
            ) : (
              <div className="text-xs text-muted-foreground p-4 text-center">
                No space events yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
