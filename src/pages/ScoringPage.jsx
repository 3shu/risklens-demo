import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, ChevronRight, Info, Zap } from 'lucide-react'
import { calcularScore, RAMOS, ACTIVIDADES, PROVINCIAS } from '../data/data.js'

const field = (label, children, hint) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</label>
    {children}
    {hint && <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 4 }}>{hint}</div>}
  </div>
)

const input = (props) => ({
  width: '100%', padding: '9px 13px', borderRadius: 7,
  background: 'var(--navy)', border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--white)', fontSize: 13,
  outline: 'none', transition: 'border 0.15s',
  ...props
})

const ScoreGauge = ({ score, nivel }) => {
  const color = nivel === 'ALTO' ? '#E84545' : nivel === 'MEDIO' ? '#F5A623' : '#2ECC71'
  const deg = (score / 100) * 180
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width="180" height="100" viewBox="0 0 180 100">
          <path d="M 10 95 A 80 80 0 0 1 170 95" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
          <path
            d="M 10 95 A 80 80 0 0 1 170 95"
            fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251} 251`}
            style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1), stroke 0.5s' }}
          />
          <text x="90" y="82" textAnchor="middle" fill={color} fontSize="32" fontWeight="700" fontFamily="Syne, sans-serif">{score}</text>
          <text x="90" y="97" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="DM Sans, sans-serif">de 100</text>
        </svg>
      </div>
      <div style={{ marginTop: 4, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color }}>
        RIESGO {nivel}
      </div>
    </div>
  )
}

export default function ScoringPage() {
  const [form, setForm] = useState({
    ramo: 'riesgos_trabajo', actividad: '4520', provincia: 'Puntarenas',
    edad: '38', num_empleados: '45', suma_asegurada: '15000000', siniestros_previos: '1',
    nombre: 'Construcciones del Sur Ltda.', cedula: '3-102-118744',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleScore = () => {
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(calcularScore(form))
      setLoading(false)
    }, 700)
  }

  const fmt = (n) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)

  const inputStyle = {
    width: '100%', padding: '9px 13px', borderRadius: 7,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'var(--white)', fontSize: 13, outline: 'none',
  }
  const selectStyle = { ...inputStyle, cursor: 'pointer' }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Shield size={20} color="var(--teal)" />
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>
            Scoring de Suscripcion
          </h1>
        </div>
        <p style={{ color: 'var(--gray)', fontSize: 13 }}>
          Ingresa los datos del cliente para obtener el score de riesgo y la prima sugerida en tiempo real.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

        {/* FORMULARIO */}
        <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>

            {field('Nombre / Razon Social',
              <input style={inputStyle} value={form.nombre} onChange={set('nombre')} placeholder="Nombre del asegurado" />
            )}
            {field('Cedula / N. Juridico',
              <input style={inputStyle} value={form.cedula} onChange={set('cedula')} placeholder="X-XXX-XXXXXX" />
            )}

            {field('Ramo',
              <select style={selectStyle} value={form.ramo} onChange={set('ramo')}>
                {RAMOS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            )}
            {field('Provincia',
              <select style={selectStyle} value={form.provincia} onChange={set('provincia')}>
                {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            )}

            {field('Actividad economica (CIIU)',
              <select style={selectStyle} value={form.actividad} onChange={set('actividad')}>
                {ACTIVIDADES.map(a => <option key={a.value} value={a.value}>{a.value} — {a.label}</option>)}
              </select>,
              'Codigo de actividad segun clasificacion CIIU'
            )}
            {field('Edad del asegurado',
              <input style={inputStyle} type="number" value={form.edad} onChange={set('edad')} min={18} max={90} />
            )}

            {field('Num. de empleados',
              <input style={inputStyle} type="number" value={form.num_empleados} onChange={set('num_empleados')} min={1} />,
              'Relevante para calcular exposicion en RT'
            )}
            {field('Suma asegurada (₡)',
              <input style={inputStyle} type="number" value={form.suma_asegurada} onChange={set('suma_asegurada')} />
            )}

            <div style={{ gridColumn: '1/-1' }}>
              {field('Siniestros previos (ultimos 3 anos)',
                <div style={{ display: 'flex', gap: 10 }}>
                  {[0, 1, 2, 3].map(n => (
                    <button key={n} onClick={() => setForm(f => ({ ...f, siniestros_previos: String(n) }))}
                      style={{
                        padding: '8px 18px', borderRadius: 7, border: '1px solid',
                        borderColor: form.siniestros_previos === String(n) ? 'var(--teal)' : 'rgba(255,255,255,0.12)',
                        background: form.siniestros_previos === String(n) ? 'rgba(0,194,180,0.15)' : 'transparent',
                        color: form.siniestros_previos === String(n) ? 'var(--teal)' : 'var(--gray)',
                        fontSize: 14, fontWeight: 600,
                      }}>
                      {n}{n === 3 ? '+' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          <button onClick={handleScore} disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 8, marginTop: 8,
            background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
            border: 'none', color: 'var(--navy)', fontWeight: 700, fontSize: 14,
            fontFamily: 'var(--font-head)', letterSpacing: '0.04em',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.8 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {loading
              ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'var(--navy)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Calculando score...</>
              : <><Zap size={16} /> Calcular Score de Riesgo</>
            }
          </button>
        </div>

        {/* RESULTADO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {!result && !loading && (
            <div style={{
              background: 'var(--navy-mid)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 32, textAlign: 'center',
            }}>
              <Shield size={36} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 12px' }} />
              <div style={{ color: 'var(--gray)', fontSize: 13 }}>Completa el formulario y presiona<br /><strong style={{ color: 'var(--white)' }}>Calcular Score</strong> para ver el resultado.</div>
            </div>
          )}

          {result && (
            <>
              {/* Score card */}
              <div className="fade-up" style={{
                background: 'var(--navy-mid)', border: `1px solid ${result.nivel === 'ALTO' ? 'rgba(232,69,69,0.3)' : result.nivel === 'MEDIO' ? 'rgba(245,166,35,0.3)' : 'rgba(46,204,113,0.3)'}`,
                borderRadius: 12, padding: 24,
              }}>
                <ScoreGauge score={result.score} nivel={result.nivel} />

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Prima sugerida</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--white)', fontWeight: 700 }}>
                    {fmt(result.primaAjustada)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>Prima anual estimada · ajustada por score</div>
                </div>

                {result.alertaFraude && (
                  <div style={{
                    marginTop: 14, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(232,69,69,0.1)', border: '1px solid rgba(232,69,69,0.3)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <AlertTriangle size={15} color="var(--red)" />
                    <span style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>Alerta de posible fraude detectada</span>
                  </div>
                )}
              </div>

              {/* Factores */}
              <div className="fade-up-1" style={{
                background: 'var(--navy-mid)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 20,
              }}>
                <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  Factores del score
                </div>
                {result.factores.length === 0
                  ? <div style={{ fontSize: 12, color: 'var(--gray)' }}>Perfil estandar, sin factores de ajuste significativos.</div>
                  : result.factores.map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 0',
                      borderBottom: i < result.factores.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: f.impacto === 'alto' ? 'var(--red)' : f.impacto === 'medio' ? 'var(--amber)' : 'var(--green)',
                      }} />
                      <span style={{ fontSize: 12, color: 'var(--text-main)' }}>{f.label}</span>
                      <span className={`badge badge-${f.impacto}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>{f.impacto}</span>
                    </div>
                  ))
                }
              </div>

              {/* Ref API */}
              <div className="fade-up-2" style={{
                background: 'rgba(10,18,40,0.8)', border: '1px solid var(--border)',
                borderRadius: 10, padding: 16,
              }}>
                <div style={{ fontSize: 10, color: 'var(--teal)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Referencia API · respuesta real
                </div>
                <pre style={{ fontSize: 10, color: 'rgba(238,242,255,0.6)', fontFamily: 'var(--font-mono)', overflow: 'auto', lineHeight: 1.7 }}>
{`{
  "score": ${result.score},
  "nivel_riesgo": "${result.nivel}",
  "prima_sugerida": ${result.primaAjustada},
  "alerta_fraude": ${result.alertaFraude},
  "factores": [${result.factores.slice(0,2).map(f => `"${f.label.substring(0,28)}..."`).join(', ')}]
}`}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
