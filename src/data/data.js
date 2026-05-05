// ─── DATOS SINTETICOS PARA DEMO ──────────────────────────────────────────────

export const PROVINCIAS = ['San Jose', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limon']

export const RAMOS = [
  { value: 'autos',            label: 'Automoviles' },
  { value: 'riesgos_trabajo',  label: 'Riesgos del Trabajo' },
  { value: 'incendio',         label: 'Incendio y L.A.' },
  { value: 'salud',            label: 'Salud' },
  { value: 'vida',             label: 'Vida' },
  { value: 'responsabilidad',  label: 'Responsabilidad Civil' },
]

export const ACTIVIDADES = [
  { value: '4520', label: 'Mantenimiento y reparacion de vehiculos' },
  { value: '4610', label: 'Venta al por mayor' },
  { value: '4711', label: 'Comercio al por menor en supermercados' },
  { value: '5610', label: 'Restaurantes y servicios de comida' },
  { value: '4100', label: 'Construccion de edificios' },
  { value: '8610', label: 'Actividades de hospitales' },
  { value: '6920', label: 'Actividades de contabilidad' },
  { value: '7010', label: 'Actividades de oficinas principales' },
  { value: '3510', label: 'Generacion de energia electrica' },
  { value: '0111', label: 'Cultivo de cereales y otros cultivos' },
]

// ─── LOGICA DE SCORING (simulada, sin API) ───────────────────────────────────

const RAMO_BASE_RISK = {
  autos:           55,
  riesgos_trabajo: 72,
  incendio:        38,
  salud:           62,
  vida:            30,
  responsabilidad: 44,
}

const ACTIVIDAD_RISK = {
  '4520': 18,  // taller mecanico — alto riesgo RT
  '4100': 22,  // construccion — alto riesgo RT
  '3510': 15,  // energia — riesgo medio-alto
  '5610': 10,  // restaurantes
  '4711':  8,  // supermercados
  '4610':  9,  // comercio mayor
  '8610': 12,  // hospitales
  '6920':  2,  // contabilidad — bajo riesgo
  '7010':  3,  // oficinas — bajo riesgo
  '0111': 14,  // agricola — riesgo clima
}

const PROVINCIA_RISK = {
  'San Jose':    0,
  'Alajuela':    3,
  'Cartago':     2,
  'Heredia':    -2,
  'Guanacaste': 10,
  'Puntarenas': 12,
  'Limon':      14,
}

export function calcularScore(form) {
  const base = RAMO_BASE_RISK[form.ramo] || 50
  const actRisk = ACTIVIDAD_RISK[form.actividad] || 8
  const provRisk = PROVINCIA_RISK[form.provincia] || 0

  const edad = parseInt(form.edad) || 35
  const edadFactor = edad < 25 ? 12 : edad > 60 ? 8 : 0

  const empleados = parseInt(form.num_empleados) || 1
  const empleadosFactor = empleados > 100 ? 10 : empleados > 50 ? 6 : empleados > 20 ? 3 : 0

  const sumaAsegurada = parseInt(form.suma_asegurada) || 5000000
  const sumaFactor = sumaAsegurada > 50000000 ? 8 : sumaAsegurada > 20000000 ? 4 : 0

  const sinPrevios = parseInt(form.siniestros_previos) || 0
  const sinFactor = sinPrevios * 9

  let score = base + actRisk + provRisk + edadFactor + empleadosFactor + sumaFactor + sinFactor
  score = Math.min(99, Math.max(5, score))

  const nivel = score >= 70 ? 'ALTO' : score >= 45 ? 'MEDIO' : 'BAJO'

  const tarifaBase = {
    autos:           sumaAsegurada * 0.035,
    riesgos_trabajo: (empleados * 280000) * (score / 100) * 1.4,
    incendio:        sumaAsegurada * 0.008,
    salud:           12 * 95000 * (1 + score / 200),
    vida:            sumaAsegurada * 0.012,
    responsabilidad: sumaAsegurada * 0.022,
  }

  const primaBase = tarifaBase[form.ramo] || sumaAsegurada * 0.025
  const primaAjustada = Math.round(primaBase * (0.6 + score / 145))

  const factores = []
  if (actRisk >= 15) factores.push({ label: 'Actividad de alto riesgo', impacto: 'alto' })
  if (provRisk >= 10) factores.push({ label: 'Zona geografica de riesgo elevado', impacto: 'alto' })
  if (sinFactor >= 9) factores.push({ label: `${sinPrevios} siniestro(s) previo(s) registrado(s)`, impacto: 'alto' })
  if (edadFactor > 0) factores.push({ label: 'Perfil etario de mayor siniestralidad', impacto: 'medio' })
  if (empleadosFactor > 0) factores.push({ label: 'Plantilla laboral amplia', impacto: 'medio' })
  if (sumaFactor > 0) factores.push({ label: 'Suma asegurada elevada', impacto: 'medio' })
  if (score < 30) factores.push({ label: 'Perfil de bajo riesgo historico', impacto: 'bajo' })
  if (provRisk < 0) factores.push({ label: 'Zona geografica de bajo siniestro', impacto: 'bajo' })

  const alertaFraude = sinPrevios >= 3 || (score > 75 && sumaAsegurada > 30000000)

  return { score, nivel, primaAjustada, factores, alertaFraude }
}

// ─── SINIESTROS SINTETICOS ───────────────────────────────────────────────────

export const SINIESTROS = [
  { id: 'SIN-2024-0891', asegurado: 'Transportes Mora S.A.',       cedula: '3-101-445821', ramo: 'Autos',           monto: 4850000,  fecha: '2024-11-03', estado: 'En revision',  alerta: 'ALTO',  alertaTexto: 'Tercer siniestro en 8 meses. Patron de frecuencia anormal.' },
  { id: 'SIN-2024-0887', asegurado: 'Juan Carlos Villalobos',       cedula: '1-0782-0341', ramo: 'Autos',           monto: 1200000,  fecha: '2024-11-01', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0882', asegurado: 'Construcciones del Sur Ltda.', cedula: '3-102-118744', ramo: 'RT',              monto: 12400000, fecha: '2024-10-29', estado: 'En revision',  alerta: 'ALTO',  alertaTexto: 'Suma reclamada 3.2x por encima del promedio del ramo RT en Puntarenas.' },
  { id: 'SIN-2024-0878', asegurado: 'Maria Fernanda Quesada',       cedula: '2-0441-0892', ramo: 'Salud',           monto: 890000,   fecha: '2024-10-27', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0871', asegurado: 'Agropecuaria Los Cedros S.A.', cedula: '3-101-772301', ramo: 'Incendio',        monto: 28000000, fecha: '2024-10-22', estado: 'Investigando', alerta: 'ALTO',  alertaTexto: 'Incendio 6 dias despues de renovacion. Asegurado con 2 siniestros anteriores en 3 anos.' },
  { id: 'SIN-2024-0865', asegurado: 'Supermercados Jimenez',        cedula: '3-101-550012', ramo: 'RT',              monto: 2100000,  fecha: '2024-10-18', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0861', asegurado: 'Roberto Arias Campos',         cedula: '6-0221-0441', ramo: 'Autos',           monto: 3400000,  fecha: '2024-10-15', estado: 'En revision',  alerta: 'MEDIO', alertaTexto: 'Accidente reportado 72h despues del evento. Testigos no corroborados.' },
  { id: 'SIN-2024-0854', asegurado: 'Clinica Santa Ana S.A.',       cedula: '3-101-334890', ramo: 'Resp. Civil',     monto: 8500000,  fecha: '2024-10-12', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0848', asegurado: 'Inversiones Caribe 2020 S.A.', cedula: '3-102-779021', ramo: 'Incendio',        monto: 45000000, fecha: '2024-10-08', estado: 'Investigando', alerta: 'ALTO',  alertaTexto: 'Proveedor de ajuste vinculado a 4 siniestros previos de alto valor en la misma provincia.' },
  { id: 'SIN-2024-0841', asegurado: 'Ana Lucia Espinoza',           cedula: '1-0994-1122', ramo: 'Vida',            monto: 15000000, fecha: '2024-10-05', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0835', asegurado: 'Taller Mecanico Los Pinos',    cedula: '3-101-882211', ramo: 'RT',              monto: 5600000,  fecha: '2024-10-01', estado: 'En revision',  alerta: 'MEDIO', alertaTexto: 'Actividad CIIU 4520 con tasa de siniestralidad RT 2.4x sobre la media del ramo.' },
  { id: 'SIN-2024-0829', asegurado: 'Carlos Badilla Nunez',         cedula: '5-0332-0771', ramo: 'Autos',           monto: 980000,   fecha: '2024-09-28', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0822', asegurado: 'Bananera del Atlantico S.A.',  cedula: '3-101-229034', ramo: 'Agropecuario',    monto: 19500000, fecha: '2024-09-24', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0815', asegurado: 'Ferreteria Industrial Hernandez', cedula: '3-101-441820', ramo: 'Incendio',     monto: 6700000,  fecha: '2024-09-20', estado: 'En revision',  alerta: 'MEDIO', alertaTexto: 'Valor declarado de inventario supera en 40% el ultimo balance fiscal reportado.' },
  { id: 'SIN-2024-0808', asegurado: 'Laura Montero Salas',          cedula: '4-0188-0552', ramo: 'Salud',           monto: 1450000,  fecha: '2024-09-17', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0801', asegurado: 'Distribuidora Norte S.R.L.',   cedula: '3-102-007714', ramo: 'Autos',           monto: 7200000,  fecha: '2024-09-14', estado: 'Investigando', alerta: 'ALTO',  alertaTexto: 'Vehiculo reportado robado aparece registrado en provincia diferente a la de la poliza.' },
  { id: 'SIN-2024-0795', asegurado: 'Jose Pablo Chaves',            cedula: '1-1102-0334', ramo: 'RT',              monto: 3300000,  fecha: '2024-09-10', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0788', asegurado: 'Hotel Vista al Mar S.A.',      cedula: '3-101-554102', ramo: 'Incendio',        monto: 32000000, fecha: '2024-09-06', estado: 'En revision',  alerta: 'MEDIO', alertaTexto: 'Segundo siniestro en 14 meses. Monto combinado supera prima total pagada x18.' },
  { id: 'SIN-2024-0781', asegurado: 'Silvia Rojas Vargas',          cedula: '2-0551-0779', ramo: 'Vida',            monto: 5000000,  fecha: '2024-09-03', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
  { id: 'SIN-2024-0774', asegurado: 'Gasolinera Central Limitada',  cedula: '3-102-114409', ramo: 'Resp. Civil',     monto: 11000000, fecha: '2024-08-30', estado: 'Aprobado',     alerta: 'LIMPIO',alertaTexto: null },
]

// ─── DATOS DE CARTERA PARA GRAFICOS ──────────────────────────────────────────

export const SINIESTRALIDAD_TREND = [
  { mes: 'Ene', real: 58, proyectado: 58 },
  { mes: 'Feb', real: 61, proyectado: 60 },
  { mes: 'Mar', real: 63, proyectado: 61 },
  { mes: 'Abr', real: 60, proyectado: 61 },
  { mes: 'May', real: 65, proyectado: 62 },
  { mes: 'Jun', real: 68, proyectado: 63 },
  { mes: 'Jul', real: 71, proyectado: 64 },
  { mes: 'Ago', real: 69, proyectado: 65 },
  { mes: 'Sep', real: null, proyectado: 63 },
  { mes: 'Oct', real: null, proyectado: 61 },
  { mes: 'Nov', real: null, proyectado: 60 },
  { mes: 'Dic', real: null, proyectado: 58 },
]

export const DISTRIBUCION_RAMO = [
  { ramo: 'Autos',   polizas: 3842, siniestralidad: 68, prima_promedio: 385000 },
  { ramo: 'RT',      polizas: 1204, siniestralidad: 74, prima_promedio: 892000 },
  { ramo: 'Incendio',polizas: 987,  siniestralidad: 41, prima_promedio: 650000 },
  { ramo: 'Salud',   polizas: 2341, siniestralidad: 63, prima_promedio: 290000 },
  { ramo: 'Vida',    polizas: 1788, siniestralidad: 28, prima_promedio: 180000 },
  { ramo: 'Resp. Civil', polizas: 445, siniestralidad: 45, prima_promedio: 520000 },
]

export const RIESGO_PROVINCIA = [
  { provincia: 'San Jose',    alto: 142, medio: 384, bajo: 891 },
  { provincia: 'Alajuela',    alto: 98,  medio: 221, bajo: 544 },
  { provincia: 'Cartago',     alto: 71,  medio: 189, bajo: 412 },
  { provincia: 'Heredia',     alto: 55,  medio: 198, bajo: 631 },
  { provincia: 'Guanacaste',  alto: 112, medio: 241, bajo: 287 },
  { provincia: 'Puntarenas',  alto: 134, medio: 218, bajo: 219 },
  { provincia: 'Limon',       alto: 88,  medio: 167, bajo: 201 },
]
