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
 * Component that renders a panel with historical space events in a Twitter-like feed.
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
    <div className="absolute top-6 right-6 z-10 w-72 bg-background/70 backdrop-blur-sm rounded-md shadow-lg border border-border overflow-hidden flex flex-col">
      {showSpaceEvents ? (
        <>
          <div className="p-2 border-b border-muted/40 font-medium text-sm text-left flex justify-between items-center">
            <span>Space Events</span>
            <button
              onClick={() => setShowSpaceEvents(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
              title="Hide panel"
            >
              <span>×</span>
            </button>
          </div>
          <div
            id="tweet-container"
            className="overflow-y-auto p-2 h-52 space-y-2 tweet-scroll"
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
              <div className="text-xs text-muted-foreground p-4 text-left">
                No space events yet
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-2 border-b border-muted/40 font-medium text-sm text-left flex justify-between items-center">
          <span>Space Events</span>
          <button
            onClick={() => setShowSpaceEvents(true)}
            className="text-xs text-muted-foreground hover:text-foreground px-2"
            title="Show panel"
          >
            <span>+</span>
          </button>
        </div>
      )}
    </div>
  );
}
