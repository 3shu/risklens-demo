import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  background: 'var(--surface-2)', border: '1px solid var(--border)',
  color: 'var(--text-main)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const ok = login(email.trim(), password)
    if (ok) {
      navigate('/', { replace: true })
    } else {
      setError('Credenciales inválidas')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 380 }} className="fade-up">

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <img
            src="/markwell_isotipo.svg"
            alt="Markwell"
            style={{ width: 64, height: 64 }}
          />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 24, color: 'var(--text-main)', letterSpacing: '-0.04em' }}>Markwell</div>
            <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>Risk Intelligence API</div>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Accede con tus credenciales de empresa.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Correo electrónico</label>
              <input
                style={inputStyle}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@empresa.com"
                required
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Contraseña</label>
              <input
                style={inputStyle}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(232,69,69,0.06)', border: '1px solid rgba(232,69,69,0.25)', color: 'var(--danger)', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px 0', borderRadius: 999, background: 'var(--accent)', border: 'none', color: 'var(--white)', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-head)', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <LogIn size={16} />
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)' }}>
          Marca el riesgo. Decide con datos.
        </p>
      </div>
    </div>
  )
}
