import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend
} from 'recharts'
import { SINIESTRALIDAD_TREND, DISTRIBUCION_RAMO, RIESGO_PROVINCIA } from '../data/data.js'

const fmt = (n) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)

const Card = ({ children, style }) => (
  <div style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, ...style }}>
    {children}
  </div>
)

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', fontFamily: 'var(--font-head)' }}>{children}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 2 }}>{sub}</div>}
  </div>
)

const tooltipStyle = {
  contentStyle: { background: '#152552', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: 'var(--gray-light)' },
  itemStyle: { color: 'var(--white)' },
}

export default function CarteraPage() {
  const totalPolizas = DISTRIBUCION_RAMO.reduce((a, r) => a + r.polizas, 0)
  const sinEstimado = DISTRIBUCION_RAMO.reduce((a, r) => a + r.polizas * r.prima_promedio * (r.siniestralidad / 100), 0)
  const sinConRiskLens = sinEstimado * 0.88

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <BarChart3 size={20} color="var(--teal)" />
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>
            Analytics de Cartera
          </h1>
        </div>
        <p style={{ color: 'var(--gray)', fontSize: 13 }}>
          Vision ejecutiva de la cartera · Datos sinteticos representativos del mercado CR · Periodo 2024
        </p>
      </div>

      {/* KPIs */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Polizas activas', value: totalPolizas.toLocaleString('es-CR'), trend: '+8.2%', up: true },
          { label: 'Siniestralidad actual', value: '67%', trend: '+2.1pp', up: false },
          { label: 'Con RiskLens (proy.)', value: '59%', trend: '-8pp', up: true },
          { label: 'Ahorro proyectado', value: fmt(sinEstimado - sinConRiskLens), trend: 'Año 1', up: true },
        ].map((k, i) => (
          <div key={i} style={{ background: 'var(--navy-mid)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 10, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              {k.up ? <TrendingUp size={12} color="var(--green)" /> : <TrendingDown size={12} color="var(--red)" />}
              <span style={{ color: k.up ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grafico tendencia siniestralidad */}
      <div className="fade-up-2" style={{ marginBottom: 20 }}>
        <Card>
          <SectionTitle sub="Siniestralidad mensual 2024 · Real vs proyeccion con RiskLens">
            Tendencia de Siniestralidad
          </SectionTitle>
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(0,194,180,0.08)', border: '1px solid rgba(0,194,180,0.2)',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
          }}>
            <Activity size={13} color="var(--teal)" />
            <span style={{ color: 'var(--teal)', fontWeight: 600 }}>Proyeccion:</span>
            <span style={{ color: 'rgba(238,242,255,0.7)' }}>
              Si RiskLens hubiera estado activo desde enero, la siniestralidad acumulada habria sido 8pp menor.
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SINIESTRALIDAD_TREND} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="mes" tick={{ fill: '#8A97B8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8A97B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 80]} tickFormatter={v => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`]} />
              <ReferenceLine y={67} stroke="rgba(232,69,69,0.4)" strokeDasharray="4 4" label={{ value: 'Sector: 67%', fill: '#E84545', fontSize: 10, position: 'right' }} />
              <Line type="monotone" dataKey="real" stroke="#E84545" strokeWidth={2.5} dot={{ fill: '#E84545', r: 3 }} connectNulls={false} name="Real" />
              <Line type="monotone" dataKey="proyectado" stroke="#00C2B4" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Con RiskLens" />
              <Legend iconType="line" wrapperStyle={{ fontSize: 11, color: '#8A97B8', paddingTop: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Siniestralidad por ramo */}
        <Card>
          <SectionTitle sub="Indice de siniestralidad incurrida por ramo (%)">
            Siniestralidad por Ramo
          </SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DISTRIBUCION_RAMO} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#8A97B8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 85]} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="ramo" tick={{ fill: '#D0D8EE', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Siniestralidad']} />
              <ReferenceLine x={67} stroke="rgba(232,69,69,0.5)" strokeDasharray="4 3" />
              <Bar dataKey="siniestralidad" radius={[0, 4, 4, 0]}>
                {DISTRIBUCION_RAMO.map((entry, i) => (
                  <Cell key={i} fill={entry.siniestralidad >= 67 ? '#E84545' : entry.siniestralidad >= 50 ? '#F5A623' : '#2ECC71'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Riesgo por provincia */}
        <Card>
          <SectionTitle sub="Distribucion de polizas por nivel de riesgo y provincia">
            Riesgo por Provincia
          </SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={RIESGO_PROVINCIA} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="provincia" tick={{ fill: '#8A97B8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8A97B8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 10, color: '#8A97B8' }} />
              <Bar dataKey="alto" name="Alto" stackId="a" fill="#E84545" />
              <Bar dataKey="medio" name="Medio" stackId="a" fill="#F5A623" />
              <Bar dataKey="bajo" name="Bajo" stackId="a" fill="#2ECC71" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabla resumen por ramo */}
      <div className="fade-up-4" style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle sub="Resumen de cartera por ramo · Prima promedio y exposicion total">
            Resumen de Cartera
          </SectionTitle>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Ramo', 'Polizas', 'Prima promedio', 'Exposicion total', 'Siniestralidad', 'Estado'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISTRIBUCION_RAMO.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '11px 12px', fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>{r.ramo}</td>
                    <td style={{ padding: '11px 12px', fontSize: 13, color: 'var(--gray-light)' }}>{r.polizas.toLocaleString('es-CR')}</td>
                    <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--gray-light)', fontFamily: 'var(--font-mono)' }}>{fmt(r.prima_promedio)}</td>
                    <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--gray-light)', fontFamily: 'var(--font-mono)' }}>{fmt(r.polizas * r.prima_promedio)}</td>
                    <td style={{ padding: '11px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
                          <div style={{ width: `${r.siniestralidad}%`, height: '100%', borderRadius: 3, background: r.siniestralidad >= 67 ? 'var(--red)' : r.siniestralidad >= 50 ? 'var(--amber)' : 'var(--green)' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: r.siniestralidad >= 67 ? 'var(--red)' : r.siniestralidad >= 50 ? 'var(--amber)' : 'var(--green)', minWidth: 32 }}>{r.siniestralidad}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                        background: r.siniestralidad >= 67 ? 'rgba(232,69,69,0.12)' : 'rgba(46,204,113,0.12)',
                        color: r.siniestralidad >= 67 ? 'var(--red)' : 'var(--green)',
                        border: `1px solid ${r.siniestralidad >= 67 ? 'rgba(232,69,69,0.25)' : 'rgba(46,204,113,0.25)'}`,
                      }}>
                        {r.siniestralidad >= 67 ? 'Atencion' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
