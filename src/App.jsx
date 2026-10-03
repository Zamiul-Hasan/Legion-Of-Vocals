import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import FloatingMessenger from "./components/Messenger/FloatingMessenger";
import useAuth from "./hooks/useAuth";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <AppRoutes />
      {/* Floating Messenger only appears for authenticated members */}
      {isAuthenticated && <FloatingMessenger />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;