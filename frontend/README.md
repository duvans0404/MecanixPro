# 🚗 MecanixPro Frontend

## 📋 Descripción
Frontend de la aplicación MecanixPro desarrollado con Angular 20.1.4, proporcionando una interfaz moderna y responsive para la gestión de talleres mecánicos.

## 🛠️ Tecnologías Utilizadas
- **Angular**: 20.1.4
- **TypeScript**: Tipado estático
- **CSS3**: Estilos modernos y responsive
- **Angular Router**: Navegación entre componentes
- **Componentes Standalone**: Arquitectura moderna de Angular

## 🏗️ Estructura del Proyecto

### Componentes Principales
- **Dashboard**: Panel principal con estadísticas y métricas
- **Órdenes de Trabajo**: Gestión de reparaciones y servicios
- **Clientes**: Administración de base de datos de clientes
- **Vehículos**: Registro y gestión de automóviles
- **Servicios**: Catálogo de servicios disponibles
- **Repuestos**: Inventario de piezas y componentes
- **Pagos**: Sistema de facturación y pagos

### Características de la UI
- **Diseño Responsive**: Adaptable a diferentes dispositivos
- **Tema Moderno**: Colores profesionales y tipografía clara
- **Navegación Intuitiva**: Sidebar con menú principal
- **Formularios Interactivos**: Modales para crear/editar elementos
- **Tablas Dinámicas**: Visualización de datos organizada

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm 9+
- Angular CLI 20+

### Pasos de Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve

# Construir para producción
ng build

# Ejecutar pruebas
ng test
```

### Comandos Útiles
```bash
# Generar nuevo componente
ng generate component components/nombre-componente --standalone

# Generar nuevo servicio
ng generate service services/nombre-servicio

# Generar nueva interfaz
ng generate interface models/nombre-interfaz
```

## 📱 Características Responsive
- **Desktop**: Layout completo con sidebar y contenido principal
- **Tablet**: Adaptación del grid y formularios
- **Mobile**: Navegación optimizada para pantallas pequeñas

## 🎨 Sistema de Diseño
- **Variables CSS**: Colores y espaciados consistentes
- **Componentes Reutilizables**: Botones, formularios, tarjetas
- **Iconografía**: Emojis para identificación visual rápida
- **Tipografía**: Jerarquía clara de información

## 🔧 Funcionalidades Implementadas
- ✅ Dashboard con métricas del taller
- ✅ CRUD de clientes con modales
- ✅ CRUD de vehículos con formularios
- ✅ Gestión de órdenes de trabajo
- ✅ Catálogo de servicios
- ✅ Inventario de repuestos
- ✅ Sistema de pagos
- ✅ Navegación entre módulos
- ✅ Diseño responsive

## 🌟 Próximas Funcionalidades
- [ ] Autenticación de usuarios
- [ ] Filtros avanzados
- [ ] Búsqueda en tiempo real
- [ ] Exportación de reportes
- [ ] Notificaciones push
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)

## 📁 Estructura de Archivos
```
src/
├── app/
│   ├── components/          # Componentes de la UI
│   │   ├── dashboard/       # Panel principal
│   │   ├── orden-trabajo/   # Gestión de OT
│   │   ├── clientes/        # Gestión de clientes
│   │   ├── vehiculos/       # Gestión de vehículos
│   │   ├── servicios/       # Catálogo de servicios
│   │   ├── repuestos/       # Inventario
│   │   ├── pagos/           # Sistema de pagos
│   │   ├── navbar/          # Barra de navegación
│   │   └── sidebar/         # Menú lateral
│   ├── models/              # Interfaces TypeScript
│   ├── services/            # Servicios de datos
│   ├── app.ts               # Componente principal
│   ├── app.routes.ts        # Configuración de rutas
│   └── app.config.ts        # Configuración de la app
├── styles.css               # Estilos globales
├── main.ts                  # Punto de entrada
└── index.html               # HTML principal
```

## 👨‍💻 Desarrollo

### Estándares de Código
- **TypeScript**: Tipado estricto y interfaces claras
- **Angular**: Componentes standalone y lazy loading
- **CSS**: BEM methodology y variables CSS
- **Responsive**: Mobile-first approach

### Testing
- **Unit Tests**: Jasmine y Karma
- **E2E Tests**: Protractor (opcional)
- **Coverage**: Reportes de cobertura de código

## 🚀 Despliegue
```bash
# Construir para producción
ng build --configuration production

# Los archivos se generan en dist/
# Subir a servidor web estático
```

## 📞 Soporte
Para dudas o sugerencias sobre el frontend, contactar al equipo de desarrollo.

---

**MecanixPro Frontend** - Interfaz moderna para talleres mecánicos 🚗✨
