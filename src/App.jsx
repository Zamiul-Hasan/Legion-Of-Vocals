import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import FloatingMessenger from "./components/Messenger/FloatingMessenger";
import ErrorBoundary from "./components/UI/ErrorBoundary";
import useAuth from "./hooks/useAuth";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>

      {/* Floating Messenger only appears for authenticated members */}
      {isAuthenticated && (
        <ErrorBoundary fallback={null}>
          <FloatingMessenger />
        </ErrorBoundary>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;