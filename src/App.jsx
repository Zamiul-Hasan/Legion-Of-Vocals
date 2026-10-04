import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import FloatingMessenger from "./components/Messenger/FloatingMessenger";
import ErrorBoundary from "./components/UI/ErrorBoundary";
import useAuth from "./hooks/useAuth";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorBoundary>
      <AppRoutes />
      {/* Floating Messenger only appears for authenticated members */}
      {isAuthenticated && (
        <ErrorBoundary fallback={null}>
          <FloatingMessenger />
        </ErrorBoundary>
      )}
    </ErrorBoundary>
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