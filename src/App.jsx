import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ScoringPage from './pages/ScoringPage.jsx'
import ClaimsPage from './pages/ClaimsPage.jsx'
import CarteraPage from './pages/CarteraPage.jsx'

function LayoutWrapper() {
  return <Layout><Outlet /></Layout>
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutWrapper />}>
              <Route path="/"           element={<ScoringPage />} />
              <Route path="/claims"     element={<ClaimsPage />} />
              <Route path="/cartera"    element={<CarteraPage />} />
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
