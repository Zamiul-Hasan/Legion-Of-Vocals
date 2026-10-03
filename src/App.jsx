import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import FloatingMessenger from "./components/Messenger/FloatingMessenger";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <FloatingMessenger />
    </BrowserRouter>
  );
}

export default App;