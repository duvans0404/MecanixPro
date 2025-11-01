# 🎨 Sistema de Modales Global - MecanixPro

## 📋 Descripción

Sistema de modales reutilizables con diseño moderno y animaciones espectaculares para visualizar detalles y confirmar eliminaciones en toda la aplicación.

## 🚀 Características

- ✨ **Diseño moderno y atractivo** con gradientes, animaciones y efectos visuales
- 🔄 **Reutilizable** para cualquier tipo de entidad (clientes, vehículos, servicios, etc.)
- 🎭 **Animaciones suaves** con Angular Animations
- 📱 **Responsive** - se adapta a móviles y tablets
- 🎨 **Personalizable** - colores, iconos y secciones configurables
- ⚡ **Gestión centralizada** con servicio global

## 📦 Componentes

### 1. ViewModalComponent
Modal para visualizar detalles de cualquier entidad.

### 2. DeleteConfirmationModalComponent
Modal para confirmar eliminaciones con advertencias y feedback visual.

### 3. GlobalModalsComponent
Componente wrapper que integra ambos modales y se conecta al servicio.

### 4. ModalService
Servicio para gestionar el estado y la lógica de los modales.

## 🎯 Uso Básico

### 1. El servicio ya está integrado globalmente

El componente `<app-global-modals>` ya está agregado al `app.html`, por lo que los modales están disponibles en toda la aplicación.

### 2. Inyectar el servicio en tu componente

\`\`\`typescript
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-mi-componente',
  // ...
})
export class MiComponente {
  constructor(private modalService: ModalService) {}
}
\`\`\`

### 3. Abrir un modal de visualización

\`\`\`typescript
// Ejemplo con un cliente
viewClient(client: Client): void {
  const config = ModalService.formatClientData(client);
  
  this.modalService.openViewModal(config, {
    onEdit: () => {
      this.modalService.closeViewModal();
      this.editClient(client);
    },
    onDelete: () => {
      this.modalService.closeViewModal();
      this.confirmDeleteClient(client);
    }
  });
}
\`\`\`

### 4. Abrir un modal de confirmación de eliminación

\`\`\`typescript
confirmDeleteClient(client: Client): void {
  this.modalService.openDeleteModal(
    {
      title: '¿Eliminar Cliente?',
      message: 'Esta acción no se puede deshacer. El cliente y toda su información serán eliminados permanentemente.',
      itemName: client.name,
      itemLabel: 'Cliente a eliminar:',
      showWarning: true,
      warningMessage: 'Se eliminarán también todos los vehículos, citas y órdenes de trabajo asociados.'
    },
    async () => {
      await this.clientService.delete(client.id).toPromise();
      this.loadClients(); // Recargar lista
      this.showSuccessMessage('Cliente eliminado exitosamente');
    }
  );
}
\`\`\`

## 🎨 Formatters Pre-configurados

El servicio incluye formatters para las entidades principales:

### Clientes
\`\`\`typescript
const config = ModalService.formatClientData(client);
this.modalService.openViewModal(config, callbacks);
\`\`\`

### Vehículos
\`\`\`typescript
const config = ModalService.formatVehicleData(vehicle);
this.modalService.openViewModal(config, callbacks);
\`\`\`

### Mecánicos
\`\`\`typescript
const config = ModalService.formatMechanicData(mechanic);
this.modalService.openViewModal(config, callbacks);
\`\`\`

### Servicios
\`\`\`typescript
const config = ModalService.formatServiceData(service);
this.modalService.openViewModal(config, callbacks);
\`\`\`

### Repuestos
\`\`\`typescript
const config = ModalService.formatPartData(part);
this.modalService.openViewModal(config, callbacks);
\`\`\`

## 🔧 Configuración Personalizada

### Crear tu propio formato

\`\`\`typescript
import { ViewModalConfig } from '../../services/modal.service';

createCustomViewModal(data: any): void {
  const config: ViewModalConfig = {
    title: data.nombre,
    subtitle: data.descripcion,
    headerIcon: 'pi pi-star',
    headerColor: 'rgba(234, 179, 8, 0.2)',
    sections: [
      {
        title: 'Sección 1',
        icon: 'pi pi-info-circle',
        fields: [
          { 
            label: 'Campo de Texto', 
            value: data.texto, 
            icon: 'pi pi-tag', 
            type: 'text' 
          },
          { 
            label: 'Email', 
            value: data.email, 
            type: 'email' 
          },
          { 
            label: 'Teléfono', 
            value: data.phone, 
            type: 'phone' 
          },
          { 
            label: 'Fecha', 
            value: data.fecha, 
            type: 'date' 
          },
          { 
            label: 'Precio', 
            value: data.precio, 
            type: 'currency' 
          },
          { 
            label: 'Estado', 
            value: data.estado,
            type: 'badge',
            badgeClass: 'badge-success' // badge-success, badge-warning, badge-danger, badge-info
          },
          { 
            label: 'Activo', 
            value: data.activo, 
            type: 'boolean' 
          }
        ]
      }
    ],
    showEdit: true,
    showDelete: true
  };

  this.modalService.openViewModal(config, {
    onEdit: () => this.edit(data),
    onDelete: () => this.confirmDelete(data)
  });
}
\`\`\`

## 📱 Tipos de Campos Disponibles

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `text` | Texto simple | Nombre, Descripción |
| `email` | Email con enlace | correo@ejemplo.com |
| `phone` | Teléfono con enlace | +1 234 567 8900 |
| `date` | Fecha formateada | 25/10/2024 |
| `datetime` | Fecha y hora | 25/10/2024 14:30 |
| `currency` | Moneda formateada | $1,234.56 |
| `badge` | Etiqueta con color | Activo, Pendiente |
| `boolean` | Sí/No con ícono | ✓ Sí / ✗ No |
| `image` | Imagen | Avatar, Logo |
| `link` | Enlace externo | www.ejemplo.com |
| `html` | Contenido HTML | Texto enriquecido |

## 🎨 Clases de Badge

- `badge-success` - Verde (Activo, Completado)
- `badge-warning` - Amarillo (Pendiente, En espera)
- `badge-danger` - Rojo (Inactivo, Cancelado)
- `badge-info` - Azul (Información)
- `badge-default` - Gris (Por defecto)

## ⚡ Ejemplo Completo

\`\`\`typescript
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(
    private clientService: ClientService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe(clients => {
      this.clients = clients;
    });
  }

  viewClient(client: Client): void {
    const config = ModalService.formatClientData(client);
    
    this.modalService.openViewModal(config, {
      onEdit: () => {
        this.modalService.closeViewModal();
        this.editClient(client);
      },
      onDelete: () => {
        this.modalService.closeViewModal();
        this.confirmDeleteClient(client);
      }
    });
  }

  editClient(client: Client): void {
    // Abrir formulario de edición
    console.log('Editar cliente:', client);
  }

  confirmDeleteClient(client: Client): void {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Cliente?',
        message: 'Esta acción no se puede deshacer.',
        itemName: client.name,
        itemLabel: 'Cliente a eliminar:',
        showWarning: true
      },
      async () => {
        try {
          await this.clientService.delete(client.id).toPromise();
          this.loadClients();
          console.log('Cliente eliminado exitosamente');
        } catch (error) {
          console.error('Error al eliminar cliente:', error);
        }
      }
    );
  }
}
\`\`\`

## 🎭 Animaciones Incluidas

- **fadeIn** - Aparición suave del overlay
- **slideUp** - Deslizamiento vertical del modal
- **bounceIn** - Rebote al aparecer (delete modal)
- **pulse** - Pulsación del ícono
- **slideInLeft** - Deslizamiento de secciones
- **fadeInUp** - Aparición de campos
- **particleFloat** - Partículas flotantes

## 🎨 Personalización de Colores

Puedes personalizar los colores del header:

\`\`\`typescript
headerColor: 'rgba(59, 130, 246, 0.2)'  // Azul
headerColor: 'rgba(16, 185, 129, 0.2)'  // Verde
headerColor: 'rgba(245, 158, 11, 0.2)'  // Naranja
headerColor: 'rgba(236, 72, 153, 0.2)'  // Rosa
headerColor: 'rgba(139, 92, 246, 0.2)'  // Púrpura
\`\`\`

## 📝 Notas Importantes

1. **No necesitas importar los componentes** - Ya están disponibles globalmente
2. **Solo inyecta ModalService** - Todo lo demás está manejado
3. **Los modales se cierran automáticamente** - Después de completar acciones
4. **Las animaciones son automáticas** - No requieren configuración adicional
5. **El modal de eliminación maneja el loading** - Muestra spinner automáticamente

## 🐛 Troubleshooting

### El modal no se muestra
- Verifica que `<app-global-modals>` esté en `app.html`
- Asegúrate de que `GlobalModalsComponent` esté importado en `app.ts`

### Las animaciones no funcionan
- Verifica que `BrowserAnimationsModule` esté importado en tu aplicación
- Asegúrate de que no haya conflictos con otros módulos de animación

### Los iconos no se muestran
- Verifica que PrimeIcons esté instalado: `npm install primeicons`
- Asegúrate de que esté importado en `styles.css`: `@import 'primeicons/primeicons.css';`

## 🚀 Próximas Mejoras

- [ ] Tema claro/oscuro automático
- [ ] Más tipos de campos (rating, progress, etc.)
- [ ] Exportar datos a PDF
- [ ] Compartir por email
- [ ] Historial de cambios
- [ ] Modo de impresión

---

¡Disfruta de los modales más geniales de MecanixPro! 🎉
