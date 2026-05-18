import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Shield, FileSearch, BarChart3, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const NAV = [
  { to: '/',           icon: Shield,     label: 'Scoring',    sub: 'Suscripcion' },
  { to: '/claims',     icon: FileSearch, label: 'Siniestros', sub: 'Antifraude' },
  { to: '/cartera',    icon: BarChart3,  label: 'Cartera',    sub: 'Analytics' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isDark = theme === 'dark'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img
            src="/markwell_logo_horizontal_dark.svg"
            alt="Markwell"
            style={{ width: '100%', maxWidth: 160, height: 'auto', display: 'block' }}
          />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(({ to, icon: Icon, label, sub }) => (
            <NavLink key={to} to={to} end={to === '/'} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                  background: isActive ? 'rgba(16,185,129,0.18)' : 'transparent',
                  border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}>
                  <Icon size={18} color={isActive ? 'var(--accent)' : 'rgba(255,255,255,0.5)'} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'var(--white)' : 'rgba(255,255,255,0.75)', lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: isActive ? 'var(--mint)' : 'rgba(255,255,255,0.4)', opacity: 0.9 }}>{sub}</div>
                  </div>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {user && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--white)', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.nombre}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          )}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', width: '100%', marginBottom: 6 }}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {isDark ? 'Modo claro' : 'Modo oscuro'}
          </button>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', width: '100%', marginBottom: 10 }}
          >
            <LogOut size={13} />
            Cerrar sesión
          </button>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            <div style={{ color: 'var(--mint)', fontWeight: 600, marginBottom: 2 }}>Demo — Datos Sintéticos</div>
            <div>Confidencial</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        {children}
      </main>
    </div>
  )
}
