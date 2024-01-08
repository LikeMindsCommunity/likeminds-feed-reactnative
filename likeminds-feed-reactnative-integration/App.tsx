import React from "react";
import { AppProvider } from "./store/AppContext";
import DemoComponent from "./screens/demoComponent";

const App1 = () => {
  return (
    <AppProvider>
      <DemoComponent />
      {/* Add other components here */}
    </AppProvider>
  );
};

export default App1;
