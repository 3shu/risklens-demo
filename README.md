# RiskLens CR — Dashboard Demo

Motor de Inteligencia de Riesgo · Demo para MNK Seguros

## Instalacion local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build para produccion

```bash
npm run build
```

## Despliegue en Vercel

1. Sube este repositorio a GitHub
2. Conecta el repo en vercel.com → "New Project"
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

El archivo `vercel.json` ya configura el routing SPA automaticamente.

## Despliegue en Netlify

1. Sube a GitHub
2. Conecta en netlify.com → "New site from Git"
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

## Estructura del proyecto

```
src/
  data/data.js          — Datos sinteticos + logica de scoring
  components/Layout.jsx — Sidebar y navegacion
  pages/
    ScoringPage.jsx     — Formulario de scoring en tiempo real
    SiniestrosPage.jsx  — Bandeja antifraude con alertas
    CarteraPage.jsx     — Analytics y graficos de cartera
```

## Nota

Todos los datos son 100% sinteticos. El scoring usa logica de reglas hardcodeadas
basada en parametros actuariales del mercado costarricense (SUGESE 2024).
