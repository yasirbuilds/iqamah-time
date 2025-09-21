import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PrayersHistoryPage from "./pages/PrayersHistoryPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prayers"
              element={
                <ProtectedRoute>
                  <PrayersHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster 
            position="bottom-right" 
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(253, 213, 53, 0.3)',
                backdropFilter: 'blur(16px)',
                color: 'white',
              },
              className: 'sonner-toast',
            }}
            closeButton={true}
            duration={4000}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
