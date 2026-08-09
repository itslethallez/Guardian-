import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import AppPrototype from './pages/AppPrototype'
import SignInPage from './pages/auth/SignInPage'
import SignUpPage from './pages/auth/SignUpPage'
import JoinPage from './pages/JoinPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/join/:token" element={<JoinPage />} />

          {/* Protected app routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppPrototype />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
