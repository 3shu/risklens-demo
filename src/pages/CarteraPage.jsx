import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend
} from 'recharts'
import { SINIESTRALIDAD_TREND, DISTRIBUCION_RAMO, RIESGO_PROVINCIA } from '../data/data.js'

const fmt = (n) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)

const Card = ({ children, style }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-sm)', ...style }}>
    {children}
  </div>
)

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-head)' }}>{children}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
  </div>
)

const tooltipStyle = {
  contentStyle: { background: 'var(--tooltip-bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, boxShadow: 'var(--shadow-md)', color: 'var(--tooltip-text)' },
  labelStyle: { color: 'var(--tooltip-text)' },
  itemStyle: { color: 'var(--tooltip-text)' },
}

export default function CarteraPage() {
  const totalPolizas = DISTRIBUCION_RAMO.reduce((a, r) => a + r.polizas, 0)
  const sinEstimado = DISTRIBUCION_RAMO.reduce((a, r) => a + r.polizas * r.prima_promedio * (r.siniestralidad / 100), 0)
  const sinConMarkwell = sinEstimado * 0.88

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <BarChart3 size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--text-main)' }}>
            Analytics de Cartera
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Vision ejecutiva de la cartera · Datos sinteticos representativos del mercado CR · Periodo 2024
        </p>
      </div>

      {/* KPIs */}
      <div className="fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Polizas activas',        value: totalPolizas.toLocaleString('es-CR'), trend: '+8.2%',  up: true },
          { label: 'Siniestralidad actual',  value: '67%',                                trend: '+2.1pp', up: false },
          { label: 'Con Markwell (proy.)',   value: '59%',                                trend: '-8pp',   up: true },
          { label: 'Ahorro proyectado',      value: fmt(sinEstimado - sinConMarkwell),    trend: 'Año 1',  up: true },
        ].map((k, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              {k.up ? <TrendingUp size={12} color="var(--success)" /> : <TrendingDown size={12} color="var(--danger)" />}
              <span style={{ color: k.up ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grafico tendencia siniestralidad */}
      <div className="fade-up-2" style={{ marginBottom: 20 }}>
        <Card>
          <SectionTitle sub="Siniestralidad mensual 2024 · Real vs proyeccion con Markwell">
            Tendencia de Siniestralidad
          </SectionTitle>
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 16,
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
          }}>
            <Activity size={13} color="var(--accent)" />
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Proyeccion:</span>
            <span style={{ color: 'var(--text-muted)' }}>
              Si Markwell hubiera estado activo desde enero, la siniestralidad acumulada habria sido 8pp menor.
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SINIESTRALIDAD_TREND} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="mes" tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 80]} tickFormatter={v => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`]} />
              <ReferenceLine y={67} stroke="rgba(232,69,69,0.4)" strokeDasharray="4 4" label={{ value: 'Sector: 67%', fill: 'var(--danger)', fontSize: 10, position: 'right' }} />
              <Line type="monotone" dataKey="real" stroke="var(--danger)" strokeWidth={2.5} dot={{ fill: 'var(--danger)', r: 3 }} connectNulls={false} name="Real" />
              <Line type="monotone" dataKey="proyectado" stroke="var(--success)" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Con Markwell" />
              <Legend iconType="line" wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)', paddingTop: 8 }} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--chart-axis)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 85]} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="ramo" tick={{ fill: 'var(--text-main)', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, 'Siniestralidad']} />
              <ReferenceLine x={67} stroke="rgba(232,69,69,0.4)" strokeDasharray="4 3" />
              <Bar dataKey="siniestralidad" radius={[0, 4, 4, 0]}>
                {DISTRIBUCION_RAMO.map((entry, i) => (
                  <Cell key={i} fill={entry.siniestralidad >= 67 ? 'var(--danger)' : entry.siniestralidad >= 50 ? 'var(--warning)' : 'var(--success)'} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="provincia" tick={{ fill: 'var(--chart-axis)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--chart-axis)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend iconType="square" wrapperStyle={{ fontSize: 10, color: 'var(--text-muted)' }} />
              <Bar dataKey="alto"  name="Alto"  stackId="a" fill="var(--danger)" />
              <Bar dataKey="medio" name="Medio" stackId="a" fill="var(--warning)" />
              <Bar dataKey="bajo"  name="Bajo"  stackId="a" fill="var(--success)" radius={[3, 3, 0, 0]} />
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
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  {['Ramo', 'Polizas', 'Prima promedio', 'Exposicion total', 'Siniestralidad', 'Estado'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISTRIBUCION_RAMO.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '11px 12px', fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>{r.ramo}</td>
                    <td style={{ padding: '11px 12px', fontSize: 13, color: 'var(--text-muted)' }}>{r.polizas.toLocaleString('es-CR')}</td>
                    <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{fmt(r.prima_promedio)}</td>
                    <td style={{ padding: '11px 12px', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{fmt(r.polizas * r.prima_promedio)}</td>
                    <td style={{ padding: '11px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--surface-elev)' }}>
                          <div style={{ width: `${r.siniestralidad}%`, height: '100%', borderRadius: 3, background: r.siniestralidad >= 67 ? 'var(--danger)' : r.siniestralidad >= 50 ? 'var(--warning)' : 'var(--success)' }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: r.siniestralidad >= 67 ? 'var(--danger)' : r.siniestralidad >= 50 ? 'var(--warning)' : 'var(--success)', minWidth: 32 }}>{r.siniestralidad}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20,
                        background: r.siniestralidad >= 67 ? 'rgba(232,69,69,0.08)' : 'rgba(16,185,129,0.08)',
                        color: r.siniestralidad >= 67 ? 'var(--danger)' : 'var(--success)',
                        border: `1px solid ${r.siniestralidad >= 67 ? 'rgba(232,69,69,0.2)' : 'rgba(16,185,129,0.2)'}`,
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
