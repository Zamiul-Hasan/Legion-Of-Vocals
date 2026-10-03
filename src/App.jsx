import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import FloatingMessenger from "./components/Messenger/FloatingMessenger";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSwitcher from "./components/Theme/ThemeSwitcher";
import SasukeChakraFAB from "./components/Theme/SasukeChakraFAB";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
        <FloatingMessenger />
        <SasukeChakraFAB />
        <ThemeSwitcher />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;