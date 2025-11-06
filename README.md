# Smart Potato Leaf

Solución tecnológica para la detección temprana de la enfermedad Phytophthora infestans en cultivos de papa basada en ResNet-50.

## Descripción del Proyecto

La rancha, causada por el hongo Phytophthora infestans, es una de las enfermedades más destructivas que afectan los cultivos de papa en el Perú. El diagnóstico tardío e impreciso, causado por la inexperiencia o un diagnóstico visual erróneo por parte del agricultor, provoca que la enfermedad se propague en exceso hasta que ya es demasiado tarde para controlarla.

Este proyecto implementa una solución basada en Deep Learning utilizando ResNet-50 para la detección temprana y precisa de la enfermedad, proporcionando una herramienta de apoyo para los agricultores peruanos.

## Stack Tecnológico

### Frontend

- [Astro 5.15.3](https://astro.build) - Framework web moderno para aplicaciones rápidas
- [Tailwind CSS v4.1.16](https://tailwindcss.com) - Framework CSS utility-first
- [TypeScript 5](https://www.typescriptlang.org/) - Tipado estático para JavaScript
- [Vite 6](https://vitejs.dev/) - Build tool de última generación

### Machine Learning

- ResNet-50 - Arquitectura de red neuronal para clasificación de imágenes
- Deep Learning - Detección de Phytophthora infestans

## Estructura del Proyecto

```
/
├── public/              # Assets estáticos
├── src/
│   ├── assets/          # Imágenes, fuentes
│   ├── components/      # Componentes organizados por bounded context
│   │   ├── auth/        # Autenticación (login, registro)
│   │   ├── detection/   # Detección de enfermedades
│   │   ├── home/        # Componentes de la página principal
│   │   ├── dashboards/  # Componentes de dashboards avanzados
│   │   ├── shared/      # Componentes compartidos (Logo, Navbar, Cards, etc.)
│   │   └── ui/          # Componentes UI genéricos
│   ├── layouts/         # Layouts de página
│   │   ├── Layout.astro        # Layout base general
│   │   └── DashboardLayout.astro # Layout con navbar para dashboard
│   ├── pages/           # Rutas de la aplicación (file-based routing)
│   │   ├── index.astro  # Landing page
│   │   ├── auth.astro   # Autenticación
│   │   ├── home.astro   # Página principal (después del login)
│   │   ├── history.astro # Historial de diagnósticos
│   │   └── dashboard.astro # Redirect a /home (backwards compatibility)
│   ├── services/        # Servicios API organizados por contexto
│   │   ├── authService.ts
│   │   └── homeService.ts
│   ├── stores/          # Nano Stores para gestión de estado global
│   │   └── authStore.ts
│   ├── types/           # Definiciones de tipos TypeScript
│   │   ├── database.ts  # ⭐ FUENTE DE VERDAD - Mapping de base de datos
│   │   ├── auth.ts      # Tipos de presentación para autenticación
│   │   ├── dashboard.ts # Tipos de presentación para dashboard
│   │   ├── plot.ts      # Tipos de presentación para parcelas
│   │   └── index.ts     # Barrel export de todos los tipos
│   └── styles/          # Estilos globales (Tailwind v4)
├── astro.config.mjs     # Configuración de Astro
├── tailwind.config.mjs  # Configuración de Tailwind
└── tsconfig.json        # Configuración de TypeScript
```

## Sistema de Tipos

### Jerarquía de Tipos

El proyecto sigue una arquitectura de tipos estricta donde **`database.ts` es la fuente de verdad absoluta**:

1. **`src/types/database.ts`** - Tipos base que mapean directamente la estructura de la base de datos PostgreSQL
   - `User`, `Plot`, `Image`, `Prediction`, `Label`, `PlotImage`, etc.
   - Usa `bigint` para IDs (compatibilidad con PostgreSQL)
   - Usa `Date` para timestamps (create_at, updated_at, etc.)

2. **Tipos de presentación** - Extienden o transforman los tipos de `database.ts`:
   - `auth.ts` - `AuthUser` referencia `User`
   - `dashboard.ts` - `Diagnostic` combina `Prediction` + `Image` + `Label`
   - `plot.ts` - `PlotSummary` extiende `Plot` con campos calculados

### Reglas Críticas

**NUNCA duplicar tipos que ya existen en `database.ts`**
**SIEMPRE importar y extender tipos de `database.ts`**
**Mantener consistencia entre frontend y backend**

### Ejemplo Correcto

```typescript
// CORRECTO - Extendiendo de database.ts
import type { Plot } from './database';

export interface PlotSummary extends Omit<Plot, 'user_id'> {
  diagnosticsCount: number;
  healthyCount: number;
  infectedCount: number;
}

// ❌ INCORRECTO - Duplicando tipo
export interface PlotSummary {
  id: string; // Debería ser bigint
  name: string;
  description?: string;
}
```

### Transformación de Datos

Los servicios transforman tipos de base de datos a tipos de presentación:

```typescript
// database.ts → Tipo base
export interface Prediction {
  id: bigint;
  image_id: bigint;
  label_id: bigint;
  confidence: number;
  predicted_at: Date;
}

// dashboard.ts → Tipo de presentación
export interface Diagnostic {
  predictionId: bigint;  // De Prediction
  imageId: bigint;       // De Image
  labelId: bigint;       // De Label
  imageUrl: string;      // Transformado de Image.filepath
  status: SeverityLevel; // Transformado de Label.name
  confidence: number;    // De Prediction
  predictedAt: Date;     // De Prediction
}
```

### Organización por Bounded Context

El proyecto sigue una arquitectura de **Bounded Contexts** (DDD) para mantener el código modular y escalable:

- **`auth/`** - Todo lo relacionado con autenticación y autorización
- **`detection/`** - Lógica y UI para detección de enfermedades
- **`home/`** - Componentes de la página principal después del login
- **`dashboards/`** - Componentes para dashboards avanzados de análisis
- **`shared/`** - Componentes compartidos entre diferentes contextos (Logo, Navbar, StatsCard, DiagnosticCard, SummaryChart)
- **`ui/`** - Componentes de interfaz genéricos y reutilizables

Esta estructura facilita:
- Separación clara de responsabilidades
- Escalabilidad del proyecto
- Mantenimiento a largo plazo
- Testing aislado por contexto

## Páginas Disponibles

### Landing Page (`/`)
Página de inicio con acceso al sistema de autenticación.

### Autenticación (`/auth`)
Sistema completo de login y registro con:
- Validaciones en tiempo real
- Indicadores de fortaleza de contraseña
- Toggle de visibilidad de contraseña
- Diseño responsive mobile-first
- Animación smooth entre modos

**Credenciales de prueba:**
- Email: `test@example.com`
- Password: `password123`
- Usuario: Usuario Test

### Home (`/home`)
Panel principal con estadísticas y diagnósticos recientes:
- **Stats Cards**: Diagnósticos semanales, porcentaje de salud general, severidad promedio
- **Últimos 5 Diagnósticos**: Lista con botón para ver historial completo
- **Gráfico de Resumen**: Barras horizontales por categoría de severidad
- **Navbar**: Navegación horizontal sticky con búsqueda integrada

Componentes:
- `StatsCard` - Tarjetas de estadísticas con cambios porcentuales
- `DiagnosticCard` - Filas horizontales de diagnósticos con estado y ubicación
- `HistoryCard` - Cards cuadradas para el grid del historial
- `SummaryChart` - Gráfico de barras para resumen por categorías
- `Navbar` - Barra de navegación horizontal responsive

### History (`/history`)
Página completa con todos los diagnósticos del usuario:
- **Filtros avanzados funcionales**:
  - Rango de fechas (De... A...) con validación:
    * "Hasta" no puede ser anterior a "Desde"
    * Validación en tiempo real
  - Severidad (Todas, Sin rancha, Rancha leve, moderada, severa)
  - Parcela (dropdown con parcelas registradas)
  - Botón "Aplicar filtros"
  - Botón "Restablecer filtros"
- **Auto-submit**: Los select filtran automáticamente al cambiar
- **Grid de cards**: 4 columnas en desktop, 2 en tablet, 1 en móvil (componente `HistoryCard`)
- **Paginación**: 8 diagnósticos por página con filtros persistentes
- **Exportar**: Botones para PDF y CSV (UI only)
- **Contador**: "Mostrando X - Y de Z diagnósticos"
- **Responsive**: Diseño adaptable mobile-first

Componentes:
- `HistoryCard` - Card cuadrada con imagen, badge, ubicación, fecha y link
- `Pagination` - Paginador con lógica inteligente de ellipsis

### Dashboard (`/dashboards`)
Página de dashboards avanzados (pendiente de implementación).

### Mis Parcelas (`/parcelas`)
Gestión de parcelas del usuario (pendiente de implementación).
- 4 parcelas dummy disponibles: Parcela A, B, C, D
- Datos: nombre, descripción, contadores de diagnósticos

## Instalación

### Requisitos Previos

- Node.js 18.0 o superior
- pnpm 8.0 o superior

### Pasos de Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/smart_potato_leaf.git
cd smart_potato_leaf
```

2. Instalar dependencias

```bash
pnpm install
```

3. Iniciar servidor de desarrollo

```bash
pnpm dev
```

El proyecto estará disponible en `http://localhost:4321`

## Credenciales de Prueba

Para probar la aplicación en desarrollo, utiliza las siguientes credenciales de acceso:

**Mock Credentials:**
- **Email:** `test@example.com`
- **Password:** `password123`
- **Usuario:** Usuario Test

Estas credenciales funcionan únicamente en modo desarrollo con datos simulados. En producción, el sistema se conectará a la API real con autenticación JWT.

## Documentación para Backend

Si eres parte del equipo de backend, revisa estos documentos:

- **`API_SPEC.md`** - Especificaciones completas de todos los endpoints requeridos
- **`BACKEND_INFO.md`** - Información sobre tipos, formato de datos y patrones del frontend

Estos documentos contienen toda la información necesaria para implementar los endpoints que el frontend consume.

## Comandos Disponibles

| Comando          | Descripción                             |
| :--------------- | :-------------------------------------- |
| `pnpm install`   | Instala las dependencias del proyecto   |
| `pnpm dev`       | Inicia el servidor de desarrollo        |
| `pnpm build`     | Construye la aplicación para producción |
| `pnpm preview`   | Previsualiza el build de producción     |
| `pnpm astro ...` | Ejecuta comandos CLI de Astro           |

## Paleta de Colores

### Principales

- `primary` - #61A253 (Verde)
- `outline` - #DEE1E6 (Gris claro)
- `error` - #DB6468 (Rojo)

### Tags de Severidad

- `tag-low` - #A4C400 (Verde lima)
- `tag-healthy` - #4CAF50 (Verde)
- `tag-mid` - #F4B400 (Amarillo)
- `tag-severe` - #D32F2F (Rojo)
- `tag-local` - #E4F09C (Lima claro)
- `tag-remote` - #9CF0E6 (Cyan)

### Estados de Interfaz

- `state-selected` - #61A253 (Verde)
- `state-idle` - #171A1F (Negro)
- `state-disabled` - #ACB3AA (Gris)

### Niveles de Confianza

- `confidence-high` - #8CE670 (Verde)
- `confidence-mid` - #E6E670 (Amarillo)
- `confidence-low` - #E67072 (Rojo)

### Controles

- `switch-on` - #05BC21 (Verde brillante)
- `switch-off` - #80B488 (Verde apagado)

## Uso de Colores

```astro
<!-- Colores principales -->
<div class="bg-primary text-white">Primary</div>
<div class="border-2 border-outline">Outline</div>
<div class="text-error">Error message</div>

<!-- Tags -->
<span class="bg-tag-healthy text-white">Healthy</span>
<span class="bg-tag-severe text-white">Severe</span>

<!-- States -->
<button class="bg-state-selected">Selected</button>
<button class="bg-state-disabled">Disabled</button>

<!-- Confidence -->
<div class="bg-confidence-high">High confidence</div>

<!-- Switch -->
<div class="bg-switch-on">Switch ON</div>
```

## Arquitectura del Modelo

El proyecto utiliza ResNet-50, una arquitectura de red neuronal convolucional profunda con 50 capas, conocida por su efectividad en tareas de clasificación de imágenes. El modelo ha sido entrenado específicamente para detectar Phytophthora infestans en hojas de papa.

## Recursos Adicionales

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
