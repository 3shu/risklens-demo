import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--white)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
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
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 380 }} className="fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 22, color: 'var(--white)', letterSpacing: '-0.02em' }}>RiskLens</div>
            <div style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>CR · Demo</div>
          </div>
        </div>

        <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderRadius: 14, padding: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 6 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 24 }}>Accede con tus credenciales de demostración.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Correo electrónico</label>
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
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Contraseña</label>
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
              <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(232,69,69,0.1)', border: '1px solid rgba(232,69,69,0.3)', color: 'var(--red)', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 13, borderRadius: 8, background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))', border: 'none', color: 'var(--navy)', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-head)', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <LogIn size={16} />
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
