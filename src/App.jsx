import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Home from './pages/home/Home'
import RegisterProducer from './pages/auth/RegisterProducer'
import RegisterBuyer from './pages/auth/RegisterBuyer'
import Dashboard from './pages/dashboard/Dashboard'
import RegisterHarvest from './pages/production/RegisterHarvest'
import AnnounceGoods from './pages/production/AnnounceGoods'
import RegisterRoute from './pages/logistics/RegisterRoute'
import SearchFreight from './pages/logistics/SearchFreight'
import Catalog from './pages/transactions/Catalog'
import FreightRequest from './pages/transactions/FreightRequest'
import TrackCargo from './pages/transactions/TrackCargo'
import ConfirmPickup from './pages/transactions/ConfirmPickup'
import ConfirmDelivery from './pages/transactions/ConfirmDelivery'
import EvaluateTransaction from './pages/evaluation/EvaluateTransaction'
import TransactionHistory from './pages/history/TransactionHistory'
import Indicators from './pages/history/Indicators'
import AdminPanel from './pages/admin/AdminPanel'

function ProtectedLayout({ children }) {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/" replace />
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {location.pathname !== '/' && <Navbar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
      <Route path="/" element={<Home />} />
          <Route path="/cadastro/produtor" element={<RegisterProducer />} />
          <Route path="/cadastro/comprador" element={<RegisterBuyer />} />

          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/producao/registrar" element={<ProtectedLayout><RegisterHarvest /></ProtectedLayout>} />
          <Route path="/producao/anunciar" element={<ProtectedLayout><AnnounceGoods /></ProtectedLayout>} />
          <Route path="/logistica/nova-rota" element={<ProtectedLayout><RegisterRoute /></ProtectedLayout>} />
          <Route path="/logistica/rotas" element={<ProtectedLayout><SearchFreight /></ProtectedLayout>} />
          <Route path="/catalogo" element={<ProtectedLayout><Catalog /></ProtectedLayout>} />
          <Route path="/transacoes/:id/frete" element={<ProtectedLayout><FreightRequest /></ProtectedLayout>} />
          <Route path="/transacoes/:id/rastrear" element={<ProtectedLayout><TrackCargo /></ProtectedLayout>} />
          <Route path="/transacoes/:id/retirada" element={<ProtectedLayout><ConfirmPickup /></ProtectedLayout>} />
          <Route path="/transacoes/:id/entrega" element={<ProtectedLayout><ConfirmDelivery /></ProtectedLayout>} />
          <Route path="/transacoes/:id/avaliar" element={<ProtectedLayout><EvaluateTransaction /></ProtectedLayout>} />
          <Route path="/historico" element={<ProtectedLayout><TransactionHistory /></ProtectedLayout>} />
          <Route path="/indicadores" element={<ProtectedLayout><Indicators /></ProtectedLayout>} />
          <Route path="/admin" element={<ProtectedLayout><AdminPanel /></ProtectedLayout>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
