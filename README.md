# 🚀 DevAcademy SaaS - Plataforma E-learning

MVP de plataforma e-learning moderna, modular y escalable para la venta de cursos de programación.

## 🛠️ Stack Tecnológico
- **Framework:** Next.js 13.5.6 (App Router)
- **Base de Datos:** Supabase (PostgreSQL)
- **ORM:** Prisma 5.11.0
- **Estilos:** Tailwind CSS + shadcn/ui
- **Auth:** Supabase SSR
- **Pagos:** Mercado Pago SDK
- **Validación:** Zod + React Hook Form
- **Notificaciones:** Sonner

## 🏗️ Estado del Proyecto

### Fase 1: Cimientos e Infraestructura
- [x] Configuración de entorno y Next.js.
- [x] Integración de Prisma y sincronización con Supabase.
- [x] Implementación de Middleware de autenticación (SSR).
- [x] Branding centralizado y sistema de temas (Dark Mode).

### Fase 2: Autenticación y Seguridad
- [x] UI de Login y Registro con shadcn/ui y Lucide React.
- [x] Validación de formularios con Zod y React Hook Form.
- [x] Lógica de autenticación mediante Server Actions y Supabase SSR.
- [x] Dashboard básico protegido por Middleware.

### Fase 3: Catálogo y Detalle de Producto
- [x] Landing Page con Glassmorphism y Framer Motion.
- [x] Modelo de datos `Course` y Catálogo dinámico.
- [x] Rutas dinámicas (`/courses/[slug]`) para detalle de producto.
- [x] Script de Seed para población inicial de datos.

### Fase 4: Pagos & Monetización
- [x] Integración de **Mercado Pago SDK** para cobros en moneda local.
- [x] Implementación de **Server Actions** para generación de Preferencias de pago.
- [x] Sistema de **Webhooks (IPN)** para sincronización de pagos en tiempo real.
- [x] Modelo de datos `Purchase` con relaciones de integridad en Prisma.
- [x] Lógica de **Smart Redirect** (`?next=`) para flujo de compra fluido post-login.

### Fase 5: Zona de Alumnos (Player)
- [x] Arquitectura de contenido jerárquica: Curso > Módulos > Lecciones.
- [x] Player de video profesional con integración de iframe (YouTube/Vimeo).
- [x] Sidebar de navegación dinámica con scroll independiente.
- [x] Sistema de protección de contenido mediante validación de `Purchase`.
- [x] Dashboard reactivo que diferencia entre alumnos y visitantes.

### Fase 6: Progreso & Gamificación
- [x] Modelo de datos `UserProgress` para persistencia de aprendizaje.
- [x] Lógica de **Server Actions** para marcado de clases completadas.
- [x] Cálculo dinámico de **Porcentaje de Progreso** por curso en el Dashboard.
- [x] UI de **Barra de Progreso Premium** con efectos de resplandor (Glow).
- [x] Indicadores visuales de finalización (Checks verdes) en toda la plataforma.

### Fase 7: Panel de Administración (CMS)
- [x] Sistema de **RBAC (Role-Based Access Control)** con protección `/admin`.
- [x] **CRUD Completo de Cursos**: Creación, edición y listado desde la web.
- [x] Generación automática de **Slugs SEO-friendly**.
- [x] Gestión de **Estructura Jerárquica**: Formularios rápidos para Módulos y Lecciones.
- [x] **Editor de Contenido**: Interfaz para carga de videos y material de apoyo.
- [x] Feedback global mediante **Sonner** para acciones administrativas.

## 🎨 Identidad Visual
- **Fondo:** Negro (#000000)
- **Acento:** Morado (#7c3aed)
- **Estilo:** Dark Premium / Glassmorphism
- **Tipografía:** Inter (Next Font)

## 🔒 Seguridad & Infraestructura
- **Auth Guard:** Middleware optimizado para protección de rutas sensibles.
- **Relational Integrity:** Restricciones en DB para evitar duplicidad de compras.
- **Caché:** Revalidación de rutas tras actualizaciones de contenido (CMS/Progreso).# elearning-saas
