import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Shield, FileSearch, BarChart3, AlertTriangle, Menu, X, Activity } from 'lucide-react'

const NAV = [
  { to: '/',          icon: Shield,      label: 'Scoring',    sub: 'Suscripcion' },
  { to: '/siniestros',icon: FileSearch,  label: 'Siniestros', sub: 'Antifraude' },
  { to: '/cartera',   icon: BarChart3,   label: 'Cartera',    sub: 'Analytics' },
]

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy)' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        background: 'var(--navy-mid)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16, color: 'var(--white)', letterSpacing: '-0.02em' }}>RiskLens</div>
              <div style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>CR · Demo</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(({ to, icon: Icon, label, sub }) => (
            <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                  background: isActive ? 'rgba(0,194,180,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(0,194,180,0.25)' : '1px solid transparent',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}>
                  <Icon size={18} color={isActive ? 'var(--teal)' : 'var(--gray)'} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'var(--white)' : 'var(--gray)', lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: isActive ? 'var(--teal)' : 'var(--gray)', opacity: 0.7 }}>{sub}</div>
                  </div>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--gray)', lineHeight: 1.5 }}>
            <div style={{ color: 'var(--teal)', fontWeight: 600, marginBottom: 2 }}>Demo — Datos Sinteticos</div>
            <div>Confidencial</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--navy)' }}>
        {children}
      </main>
    </div>
  )
}
