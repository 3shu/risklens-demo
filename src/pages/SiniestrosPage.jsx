import { useState } from 'react'
import { FileSearch, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { SINIESTROS } from '../data/data.js'

const fmt = (n) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)

const AlertaBadge = ({ alerta }) => {
  if (alerta === 'LIMPIO') return <span className="badge badge-limpio"><CheckCircle size={10} />Limpio</span>
  if (alerta === 'ALTO')   return <span className="badge badge-alto"><AlertTriangle size={10} />Alto</span>
  if (alerta === 'MEDIO')  return <span className="badge badge-medio"><AlertTriangle size={10} />Medio</span>
  return null
}

const EstadoBadge = ({ estado }) => {
  const variant = {
    'Aprobado':     'limpio',
    'En revision':  'medio',
    'Investigando': 'alto',
  }[estado] || 'medio'
  return <span className={`badge badge-${variant}`}>{estado}</span>
}

export default function SiniestrosPage() {
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [expandido, setExpandido] = useState(null)

  const filtrados = SINIESTROS.filter(s => {
    const matchFiltro = filtro === 'todos' || (filtro === 'alertas' && s.alerta !== 'LIMPIO') || (filtro === 'alto' && s.alerta === 'ALTO')
    const matchBusqueda = !busqueda || s.asegurado.toLowerCase().includes(busqueda.toLowerCase()) || s.id.includes(busqueda) || s.ramo.toLowerCase().includes(busqueda.toLowerCase())
    return matchFiltro && matchBusqueda
  })

  const totalAltas = SINIESTROS.filter(s => s.alerta === 'ALTO').length
  const totalMedias = SINIESTROS.filter(s => s.alerta === 'MEDIO').length
  const montoAlertas = SINIESTROS.filter(s => s.alerta !== 'LIMPIO').reduce((a, s) => a + s.monto, 0)

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <FileSearch size={20} color="var(--accent)" />
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--text-main)' }}>
            Antifraude en Siniestros
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Bandeja de siniestros con alertas automaticas. Casos marcados por el motor de deteccion de anomalias.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }} className="fade-up-1">
        {[
          { label: 'Total expedientes', value: SINIESTROS.length, color: 'var(--text-main)' },
          { label: 'Alertas altas',     value: totalAltas,        color: 'var(--danger)' },
          { label: 'Alertas medias',    value: totalMedias,       color: 'var(--warning)' },
          { label: 'Monto en riesgo',   value: fmt(montoAlertas), color: 'var(--accent)', small: true },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: s.small ? 'var(--font-mono)' : 'var(--font-head)', fontSize: s.small ? 14 : 24, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="fade-up-2" style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { k: 'todos',   label: 'Todos' },
            { k: 'alertas', label: 'Con alerta' },
            { k: 'alto',    label: 'Alto riesgo' },
          ].map(f => (
            <button key={f.k} onClick={() => setFiltro(f.k)} style={{
              padding: '7px 16px', border: 'none',
              background: filtro === f.k ? 'rgba(16,185,129,0.1)' : 'transparent',
              color: filtro === f.k ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 600,
            }}>{f.label}</button>
          ))}
        </div>

        <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Buscar por asegurado, ID o ramo..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 32px', borderRadius: 8,
              background: 'var(--surface)', border: '1px solid var(--border)',
              color: 'var(--text-main)', fontSize: 12, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="fade-up-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* Header tabla */}
        <div style={{
          display: 'grid', gridTemplateColumns: '140px 1fr 90px 100px 110px 90px 36px',
          padding: '10px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)',
          fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <span>Expediente</span><span>Asegurado</span><span>Ramo</span><span>Monto</span><span>Estado</span><span>Alerta</span><span></span>
        </div>

        {filtrados.map((s, i) => (
          <div key={s.id}>
            <div
              onClick={() => setExpandido(expandido === s.id ? null : s.id)}
              style={{
                display: 'grid', gridTemplateColumns: '140px 1fr 90px 100px 110px 90px 36px',
                padding: '13px 20px', alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                background: expandido === s.id ? 'rgba(16,185,129,0.04)' : s.alerta === 'ALTO' ? 'rgba(232,69,69,0.02)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>{s.id}</span>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 500 }}>{s.asegurado}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.cedula} · {s.fecha}</div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.ramo}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-main)' }}>{fmt(s.monto)}</span>
              <span><EstadoBadge estado={s.estado} /></span>
              <span><AlertaBadge alerta={s.alerta} /></span>
              <span style={{ color: 'var(--text-muted)' }}>
                {expandido === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </div>

            {/* Panel expandible */}
            {expandido === s.id && s.alertaTexto && (
              <div style={{
                padding: '14px 20px 14px 160px',
                background: 'rgba(232,69,69,0.04)',
                borderBottom: '1px solid rgba(232,69,69,0.12)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <AlertTriangle size={15} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Razon de alerta · Motor Markwell</div>
                  <div style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.6 }}>{s.alertaTexto}</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(232,69,69,0.08)', border: '1px solid rgba(232,69,69,0.25)', color: 'var(--danger)', fontSize: 11, fontWeight: 600 }}>
                      Enviar a investigacion
                    </button>
                    <button style={{ padding: '6px 14px', borderRadius: 6, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11 }}>
                      Marcar como revisado
                    </button>
                  </div>
                </div>
              </div>
            )}
            {expandido === s.id && !s.alertaTexto && (
              <div style={{
                padding: '12px 20px 12px 160px',
                background: 'rgba(16,185,129,0.03)',
                borderBottom: '1px solid rgba(16,185,129,0.12)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <CheckCircle size={14} color="var(--success)" />
                <span style={{ fontSize: 12, color: 'var(--success)' }}>Sin anomalias detectadas. Expediente con perfil de riesgo normal.</span>
              </div>
            )}
          </div>
        ))}

        {filtrados.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            No se encontraron expedientes con ese criterio.
          </div>
        )}
      </div>
    </div>
  )
}
