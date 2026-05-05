import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ScoringPage from './pages/ScoringPage.jsx'
import SiniestrosPage from './pages/SiniestrosPage.jsx'
import CarteraPage from './pages/CarteraPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"            element={<ScoringPage />} />
          <Route path="/siniestros"  element={<SiniestrosPage />} />
          <Route path="/cartera"     element={<CarteraPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
