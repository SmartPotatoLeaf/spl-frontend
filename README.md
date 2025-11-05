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
│   │   ├── shared/      # Componentes compartidos (Logo, etc.)
│   │   └── ui/          # Componentes UI genéricos
│   ├── layouts/         # Layouts de página
│   ├── pages/           # Rutas de la aplicación (file-based routing)
│   ├── services/        # Servicios API organizados por contexto
│   │   └── authService.ts
│   ├── stores/          # Nano Stores para gestión de estado global
│   │   └── authStore.ts
│   ├── types/           # Definiciones de tipos TypeScript
│   │   ├── auth.ts
│   │   └── index.ts
│   └── styles/          # Estilos globales (Tailwind v4)
├── astro.config.mjs     # Configuración de Astro
├── tailwind.config.mjs  # Configuración de Tailwind
└── tsconfig.json        # Configuración de TypeScript
```

### Organización por Bounded Context

El proyecto sigue una arquitectura de **Bounded Contexts** (DDD) para mantener el código modular y escalable:

- **`auth/`** - Todo lo relacionado con autenticación y autorización
- **`detection/`** - Lógica y UI para detección de enfermedades
- **`shared/`** - Componentes compartidos entre diferentes contextos
- **`ui/`** - Componentes de interfaz genéricos y reutilizables

Esta estructura facilita:
- ✅ Separación clara de responsabilidades
- ✅ Escalabilidad del proyecto
- ✅ Mantenimiento a largo plazo
- ✅ Testing aislado por contexto

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

Estas credenciales funcionan únicamente en modo desarrollo con datos simulados. En producción, el sistema se conectará a la API real con autenticación JWT.

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
