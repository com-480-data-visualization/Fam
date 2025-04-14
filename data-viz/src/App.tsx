import Layout from "./components/common/Layout";
import { TimelineProvider } from "./contexts/TimelineContext";
import { SelectionProvider } from "./contexts/SelectionContext";
import "./App.css";

function App() {
  return (
    <TimelineProvider>
      <SelectionProvider>
        <Layout />
      </SelectionProvider>
    </TimelineProvider>
  );
}

export default App;
