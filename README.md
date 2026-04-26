# FocusMind Landing · Experimento 1

Landing page de validación (Smoke Test) para FocusMind con sistema de métricas en tiempo real.

## Stack

- **Next.js 15** App Router + TypeScript
- **Vercel KV** (Redis) para persistir visitas, registros y clics
- **Edge Runtime** en las API routes (latencia mínima)
- Deploy en **Vercel** (gratis)

---

## Despliegue en Vercel (paso a paso)

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "feat: focusmind landing inicial"
gh repo create focusmind-landing --public --push
```

### 2. Crear proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Vercel detecta Next.js automáticamente → clic en **Deploy**

### 3. Conectar Vercel KV (Redis)

1. En el dashboard de tu proyecto: **Storage → Create Database → KV**
2. Dale un nombre (ej: `focusmind-kv`) → **Create**
3. Clic en **Connect Project** → selecciona tu proyecto
4. Vercel inyecta `KV_REST_API_URL` y `KV_REST_API_TOKEN` automáticamente

### 4. Variables de entorno opcionales

En **Settings → Environment Variables** del proyecto en Vercel:

| Variable | Descripción |
|---|---|
| `METRICS_SECRET` | Token para proteger `/metrics` (opcional, pero recomendado) |

### 5. Redesplegar

Después de conectar KV, haz un nuevo deploy (o push a main) para que las variables surtan efecto.

---

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Landing page pública |
| `/metrics` | Dashboard del experimento (pide token si definiste `METRICS_SECRET`) |

## API Routes

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/track` | POST | Registra eventos: `{ event: "visit" }` o `{ event: "app_click" }` |
| `/api/register` | POST | Guarda un email: `{ email: "..." }` |
| `/api/metrics` | GET | Lee todas las métricas (acepta `?token=...`) |

---

## Desarrollo local

```bash
npm install

# Crea un .env.local con tus credenciales KV (o usa el fallback local)
cp .env.example .env.local

npm run dev
```

> **Sin KV en local:** las API routes arrojarán error 500. Para desarrollo,
> puedes crear una base KV gratuita en Vercel y copiar las credenciales a `.env.local`.

---

## Criterios del Experimento 1

| Resultado | Acción |
|---|---|
| ≥ 10% conversión | Hipótesis validada ✅ |
| 5–9% | Ajustar propuesta de valor ⚠️ |
| < 5% | Replantear solución ❌ |

Meta de muestra: **150–200 visitantes** en 7 días.
