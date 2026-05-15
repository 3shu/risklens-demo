import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Zap, Wifi, WifiOff, Lock } from 'lucide-react'
import { calcularScore, RAMOS, ACTIVIDADES, PROVINCIAS } from '../data/data.js'
import { useAuth } from '../contexts/AuthContext'
import { signRequest } from '../lib/sign'

const API_URL = import.meta.env.VITE_API_URL || ''
const FREE_LIMIT = 300

const fmt = (n) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)

const inputStyle = {
  width: '100%', padding: '9px 13px', borderRadius: 7,
  background: 'var(--surface-2)', border: '1px solid var(--border)',
  color: 'var(--text-main)', fontSize: 13, outline: 'none',
}
const selectStyle = { ...inputStyle, cursor: 'pointer' }

const Field = ({ label, children, hint }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{hint}</div>}
  </div>
)

const ScoreGauge = ({ score, nivel }) => {
  const color = nivel === 'ALTO' ? 'var(--danger)' : nivel === 'MEDIO' ? 'var(--warning)' : 'var(--success)'
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path d="M 10 95 A 80 80 0 0 1 170 95" fill="none" stroke="var(--surface-elev)" strokeWidth="12" strokeLinecap="round" />
        <path d="M 10 95 A 80 80 0 0 1 170 95" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 251} 251`}
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
        <text x="90" y="82" textAnchor="middle" fill={color} fontSize="32" fontWeight="700" fontFamily="Inter, sans-serif">{score}</text>
        <text x="90" y="97" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="Inter, sans-serif">de 100</text>
      </svg>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color }}>RIESGO {nivel}</div>
    </div>
  )
}

const TokenBar = ({ usado, limite }) => {
  const pct = Math.min(100, (usado / limite) * 100)
  const color = pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--success)'
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan gratuito · 1 ramo</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color }}>{Math.max(0, limite - usado)} / {limite} restantes</span>
      </div>
      <div style={{ height: 5, background: 'var(--surface-elev)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
      {limite - usado <= 50 && limite - usado > 0 && (
        <div style={{ fontSize: 11, color: 'var(--warning)', marginTop: 6 }}>Quedan pocas consultas. Contacta a Markwell para continuar.</div>
      )}
    </div>
  )
}

const QuotaWall = ({ mensaje }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
    <Lock size={36} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
    <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Periodo gratuito completado</div>
    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
      {mensaje || (<>Has usado tus <strong style={{ color: 'var(--text-main)' }}>300 consultas gratuitas</strong>.<br />El modelo se entrenará con sus datos reales en el siguiente ciclo.</>)}
    </div>
    <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '16px 24px', marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>Plan Professional</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--text-main)', fontWeight: 700 }}>$1,000 USD / mes</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>3,000 consultas · Todos los ramos · Antifraude incluido</div>
    </div>
    <a href="mailto:mario@markwell.ai?subject=Activar suscripcion Markwell Professional"
      style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 999, background: 'var(--accent)', color: 'var(--white)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
      Contactar para activar
    </a>
  </div>
)

export default function ScoringPage() {
  const { user } = useAuth()
  const API_KEY = user?.apiKey || import.meta.env.VITE_API_KEY || 'demo-key'
  const SECRET_CLI = user?.secret_ref || import.meta.env.VITE_SECRET_CLI || ''
  const tokenKey = `rl_tokens_${user?.email || 'demo'}`
  const [form, setForm] = useState({
    ramo: 'riesgos_trabajo', actividad_ciiu: '4520', provincia: 'Puntarenas',
    edad: '38', num_empleados: '45', suma_asegurada: '15000000',
    siniestros_previos: '1', antiguedad_cliente: '2', canal: 'agente',
    nombre: 'Construcciones del Sur Ltda.', cedula: '3-102-118744',
  })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [usingApi, setUsingApi] = useState(!!API_URL)
  const [apiError, setApiError] = useState(null)
  const [quotaMensaje, setQuotaMensaje] = useState(null)
  const [tokensUsado, setTokensUsado] = useState(() => parseInt(localStorage.getItem(tokenKey) || '0'))
  const [quotaAgotada, setQuotaAgotada] = useState(() => parseInt(localStorage.getItem(tokenKey) || '0') >= FREE_LIMIT)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleScore = async () => {
    if (quotaAgotada) return
    setLoading(true)
    setResult(null)
    setApiError(null)

    try {
      let data

      if (API_URL) {
        const { nombre: _n, cedula: _c, ...safeForm } = form
        const payload = {
          ...safeForm,
          edad: parseInt(safeForm.edad), num_empleados: parseInt(safeForm.num_empleados),
          suma_asegurada: parseInt(safeForm.suma_asegurada),
          siniestros_previos: parseInt(safeForm.siniestros_previos),
          antiguedad_cliente: parseInt(safeForm.antiguedad_cliente),
        }

        // Firmar la request con HMAC-SHA256. El body devuelto es el JSON exacto
        // que fue firmado — debe usarse tal cual o la firma deja de coincidir.
        const { headers, body } = await signRequest({
          apiKey: API_KEY,
          secret: SECRET_CLI,
          payload,
        })

        const res = await fetch(`${API_URL}/score`, {
          method: 'POST',
          headers,
          body,
        })
        if (res.status === 401) {
          const body = await res.json().catch(() => ({}))
          setApiError({ titulo: 'API key inválida', mensaje: body.mensaje || 'La API key configurada no es válida o no tiene permisos.' })
          setLoading(false)
          return
        }
        if (res.status === 402) {
          const body = await res.json().catch(() => ({}))
          setQuotaMensaje(body.mensaje || null)
          setQuotaAgotada(true)
          setLoading(false)
          return
        }
        if (res.status === 403) {
          const body = await res.json().catch(() => ({}))
          setApiError({ titulo: 'Ramo no autorizado', mensaje: body.mensaje || 'Acceso no autorizado para este ramo.' })
          setLoading(false)
          return
        }
        if (!res.ok) throw new Error(`API ${res.status}`)
        data = await res.json()
        const restantes = data.tokens_restantes ?? FREE_LIMIT
        const nuevoUsado = FREE_LIMIT - restantes
        setTokensUsado(nuevoUsado)
        localStorage.setItem(tokenKey, String(nuevoUsado))
        setQuotaAgotada(restantes <= 0)
      } else {
        await new Promise(r => setTimeout(r, 700))
        const local = calcularScore({ ...form })
        const nuevoUsado = tokensUsado + 1
        setTokensUsado(nuevoUsado)
        localStorage.setItem(tokenKey, String(nuevoUsado))
        if (nuevoUsado >= FREE_LIMIT) setQuotaAgotada(true)
        data = { ...local, nivel_riesgo: local.nivel, prima_sugerida: local.primaAjustada, tokens_restantes: FREE_LIMIT - nuevoUsado, modelo_version: '1.0.0-demo' }
      }
      setResult(data)
    } catch {
      const local = calcularScore({ ...form })
      const nuevoUsado = tokensUsado + 1
      setTokensUsado(nuevoUsado)
      localStorage.setItem(tokenKey, String(nuevoUsado))
      if (nuevoUsado >= FREE_LIMIT) setQuotaAgotada(true)
      setResult({ ...local, nivel_riesgo: local.nivel, prima_sugerida: local.primaAjustada, tokens_restantes: FREE_LIMIT - nuevoUsado, modelo_version: '1.0.0-demo' })
      setUsingApi(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }} className="fade-up">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Shield size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--text-main)' }}>Scoring de Suscripcion</h1>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, background: usingApi ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)', color: usingApi ? 'var(--success)' : 'var(--text-muted)', border: `1px solid ${usingApi ? 'rgba(16,185,129,0.25)' : 'rgba(100,116,139,0.2)'}` }}>
            {usingApi ? <Wifi size={10} /> : <WifiOff size={10} />}
            {usingApi ? 'Modelo real activo' : 'Modo demo local'}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Score generado por el modelo entrenado con datos del mercado asegurador de Costa Rica.</p>
      </div>

      <TokenBar usado={tokensUsado} limite={FREE_LIMIT} />

      {apiError && (
        <div style={{ background: 'rgba(232,69,69,0.06)', border: '1px solid rgba(232,69,69,0.25)', borderRadius: 10, padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <AlertTriangle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 600, marginBottom: 4 }}>{apiError.titulo}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{apiError.mensaje}</div>
          </div>
          <a href="mailto:support@markwell.ai?subject=Soporte Markwell" style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 7, background: 'rgba(232,69,69,0.08)', border: '1px solid rgba(232,69,69,0.25)', color: 'var(--danger)', fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Contactar
          </a>
        </div>
      )}

      {quotaAgotada ? <QuotaWall mensaje={quotaMensaje} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <Field label="Nombre / Razon Social"><input style={inputStyle} value={form.nombre} onChange={set('nombre')} /></Field>
              <Field label="Cedula / N. Juridico"><input style={inputStyle} value={form.cedula} onChange={set('cedula')} /></Field>
              <Field label="Ramo"><select style={selectStyle} value={form.ramo} onChange={set('ramo')}>{RAMOS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></Field>
              <Field label="Provincia"><select style={selectStyle} value={form.provincia} onChange={set('provincia')}>{PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}</select></Field>
              <Field label="Actividad CIIU" hint="Clasificacion CIIU Rev.4"><select style={selectStyle} value={form.actividad_ciiu} onChange={set('actividad_ciiu')}>{ACTIVIDADES.map(a => <option key={a.value} value={a.value}>{a.value} — {a.label}</option>)}</select></Field>
              <Field label="Canal de venta"><select style={selectStyle} value={form.canal} onChange={set('canal')}><option value="agente">Agente</option><option value="corredor">Corredor</option><option value="directo">Directo</option></select></Field>
              <Field label="Edad"><input style={inputStyle} type="number" value={form.edad} onChange={set('edad')} min={18} max={90} /></Field>
              <Field label="Antiguedad cliente (anos)"><input style={inputStyle} type="number" value={form.antiguedad_cliente} onChange={set('antiguedad_cliente')} min={0} /></Field>
              <Field label="Num. empleados"><input style={inputStyle} type="number" value={form.num_empleados} onChange={set('num_empleados')} min={1} /></Field>
              <Field label="Suma asegurada (CRC)"><input style={inputStyle} type="number" value={form.suma_asegurada} onChange={set('suma_asegurada')} /></Field>
              <div style={{ gridColumn: '1/-1' }}>
                <Field label="Siniestros previos (3 anos)">
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[0,1,2,3].map(n => (
                      <button key={n} onClick={() => setForm(f => ({ ...f, siniestros_previos: String(n) }))} style={{ padding: '8px 20px', borderRadius: 7, border: '1px solid', borderColor: form.siniestros_previos === String(n) ? 'var(--accent)' : 'var(--border)', background: form.siniestros_previos === String(n) ? 'rgba(16,185,129,0.1)' : 'var(--surface-2)', color: form.siniestros_previos === String(n) ? 'var(--accent)' : 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
                        {n}{n === 3 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
            <button onClick={handleScore} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 999, marginTop: 8, background: 'var(--accent)', border: 'none', color: 'var(--white)', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-head)', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--white)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />Calculando...</> : <><Zap size={16} />Calcular Score de Riesgo</>}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!result && !loading && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <Shield size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Completa el formulario y presiona<br /><strong style={{ color: 'var(--text-main)' }}>Calcular Score</strong></div>
              </div>
            )}
            {result && (
              <>
                <div className="fade-up" style={{ background: 'var(--surface)', border: `1px solid ${result.nivel_riesgo === 'ALTO' ? 'rgba(232,69,69,0.25)' : result.nivel_riesgo === 'MEDIO' ? 'rgba(245,166,35,0.25)' : 'rgba(16,185,129,0.25)'}`, borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <ScoreGauge score={result.score} nivel={result.nivel_riesgo} />
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Prima sugerida</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--text-main)', fontWeight: 700 }}>{fmt(result.prima_sugerida)}</div>
                  </div>
                  {result.alerta_fraude && (
                    <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: 'rgba(232,69,69,0.06)', border: '1px solid rgba(232,69,69,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertTriangle size={15} color="var(--danger)" />
                      <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>Alerta de posible fraude detectada</span>
                    </div>
                  )}
                </div>
                {result.factores?.length > 0 && (
                  <div className="fade-up-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Factores del score</div>
                    {result.factores.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < result.factores.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: f.impacto === 'alto' ? 'var(--danger)' : f.impacto === 'medio' ? 'var(--warning)' : 'var(--success)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-main)' }}>{f.label}</span>
                        <span className={`badge badge-${f.impacto}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>{f.impacto}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="fade-up-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Respuesta API</div>
                  <pre style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'auto', lineHeight: 1.7 }}>
{`{
  "score": ${result.score},
  "nivel_riesgo": "${result.nivel_riesgo}",
  "prima_sugerida": ${result.prima_sugerida},
  "alerta_fraude": ${result.alerta_fraude},
  "tokens_restantes": ${result.tokens_restantes ?? FREE_LIMIT - tokensUsado},
  "modelo_version": "${result.modelo_version || '1.0.0'}"
}`}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
