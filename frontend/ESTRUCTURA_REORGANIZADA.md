# MecanixPro Frontend - Estructura Reorganizada

## 📁 Nueva Estructura del Proyecto

```
frontend/
├── docs/                           # Documentación del proyecto
├── legacy-backup/                  # Archivos legacy respaldados
├── public/                         # Archivos estáticos
│   └── assets/
├── src/
│   ├── app/
│   │   ├── components/            # Componentes base y layout
│   │   │   ├── auth/             # Componentes de autenticación
│   │   │   ├── dashboard/        # Dashboard principal
│   │   │   │   └── dashboard-main/ 
│   │   │   └── navigation/       # Componentes de navegación
│   │   │       └── sidebar/      # Sidebars por rol
│   │   │
│   │   ├── core/                 # Servicios core y funcionalidad central
│   │   │   ├── guards/           # Route guards
│   │   │   ├── interceptors/     # HTTP interceptors
│   │   │   └── services/         # Servicios principales
│   │   │
│   │   ├── features/             # Módulos de funcionalidades
│   │   │   ├── appointments/     # Gestión de citas
│   │   │   ├── clients/          # Gestión de clientes
│   │   │   ├── insurance/        # Gestión de seguros
│   │   │   ├── mechanics/        # Gestión de mecánicos
│   │   │   ├── parts/            # Gestión de repuestos
│   │   │   ├── payments/         # Gestión de pagos
│   │   │   ├── services/         # Gestión de servicios
│   │   │   ├── vehicles/         # Gestión de vehículos
│   │   │   └── work-orders/      # Órdenes de trabajo
│   │   │
│   │   ├── shared/               # Recursos compartidos
│   │   │   ├── components/       # Componentes reutilizables
│   │   │   └── models/           # Modelos/interfaces TypeScript
│   │   │
│   │   └── styles/               # Estilos globales y temas
│   │
│   └── styles/                    # Estilos de aplicación
├── angular.json
├── package.json
└── README.md
```

## 🎯 Beneficios de la Nueva Estructura

### ✅ Mejor Organización
- **Separación clara** entre core, features y shared
- **Estructura escalable** siguiendo las mejores prácticas de Angular
- **Fácil navegación** por el código

### 🔧 Core Module
- Contiene servicios esenciales, guards e interceptors
- Centraliza la lógica de autenticación y permisos
- Facilita el mantenimiento de funcionalidades críticas

### 🚀 Features Module
- Cada funcionalidad está autocontenida
- Facilita el desarrollo en equipo
- Permite lazy loading futuro de módulos

### 🔄 Shared Module
- Componentes reutilizables (modales, etc.)
- Modelos e interfaces comunes
- Reduce duplicación de código

## 📋 Cambios Realizados

1. ✅ **Movido features** a `/features/` (clients, vehicles, services, etc.)
2. ✅ **Reorganizado core** en `/core/` (services, guards, interceptors)
3. ✅ **Centralizado shared** en `/shared/` (components, models)
4. ✅ **Estructurado navigation** en `/components/navigation/sidebar/`
5. ✅ **Organizado dashboard** en `/components/dashboard/dashboard-main/`
6. ✅ **Actualizado imports** en todos los archivos
7. ✅ **Documentación** movida a `/docs/`
8. ✅ **Legacy files** respaldados en `/legacy-backup/`

## 🔗 Imports Actualizados

Los imports han sido actualizados para reflejar la nueva estructura:

```typescript
// Servicios core
import { AuthService } from './core/services/auth.service';

// Features
import { ClientsGetallComponent } from './features/clients/clients-getall/clients-getall.component';

// Shared
import { GlobalModalsComponent } from './shared/components/global-modals.component';
```

## 📝 Notas Importantes

- **Legacy files**: Los archivos legacy están respaldados en `legacy-backup/` por si se necesitan
- **Documentación**: La documentación técnica está ahora en `docs/`
- **Compatibilidad**: Todos los imports han sido actualizados para mantener funcionalidad
- **Escalabilidad**: La estructura está preparada para futuras expansiones

## 🚀 Próximos Pasos Recomendados

1. **Implementar lazy loading** para los feature modules
2. **Crear barrel exports** (`index.ts`) en cada módulo
3. **Añadir feature-specific services** dentro de cada feature
4. **Implementar shared utilities** en el módulo shared
5. **Considerar micro-frontends** para funcionalidades complejas