/**
 * EJEMPLOS DE USO - MODALES GLOBALES
 * MecanixPro - Sistema de Modales Reutilizables
 * 
 * Este archivo contiene ejemplos prácticos de cómo implementar
 * los modales globales en diferentes componentes de la aplicación.
 */

// ============================================
// EJEMPLO 1: COMPONENTE DE VEHÍCULOS
// ============================================

import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html'
})
export class VehiclesComponent {
  constructor(
    private vehicleService: VehicleService,
    private modalService: ModalService
  ) {}

  // Ver detalles del vehículo
  viewVehicle(vehicle: any): void {
    const config = ModalService.formatVehicleData(vehicle);
    
    this.modalService.openViewModal(config, {
      onEdit: () => {
        this.modalService.closeViewModal();
        this.editVehicle(vehicle);
      },
      onDelete: () => {
        this.modalService.closeViewModal();
        this.confirmDeleteVehicle(vehicle);
      }
    });
  }

  // Confirmar eliminación de vehículo
  confirmDeleteVehicle(vehicle: any): void {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Vehículo?',
        message: 'El vehículo será eliminado permanentemente del sistema.',
        itemName: `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`,
        itemLabel: 'Vehículo a eliminar:',
        warningMessage: 'Se eliminarán todas las órdenes de trabajo y el historial asociado.'
      },
      async () => {
        await this.vehicleService.delete(vehicle.id).toPromise();
        this.loadVehicles();
      }
    );
  }

  editVehicle(vehicle: any): void {
    // Navegar a edición o abrir formulario
  }

  loadVehicles(): void {
    // Cargar lista de vehículos
  }
}

// ============================================
// EJEMPLO 2: COMPONENTE DE MECÁNICOS
// ============================================

@Component({
  selector: 'app-mechanics',
  templateUrl: './mechanics.component.html'
})
export class MechanicsComponent {
  constructor(
    private mechanicService: MechanicService,
    private modalService: ModalService
  ) {}

  viewMechanic(mechanic: any): void {
    const config = ModalService.formatMechanicData(mechanic);
    
    this.modalService.openViewModal(config, {
      onEdit: () => {
        this.modalService.closeViewModal();
        this.editMechanic(mechanic);
      },
      onDelete: () => {
        this.modalService.closeViewModal();
        this.confirmDeleteMechanic(mechanic);
      }
    });
  }

  confirmDeleteMechanic(mechanic: any): void {
    this.modalService.openDeleteModal(
      {
        title: '¿Desactivar Mecánico?',
        message: 'El mecánico será desactivado y no podrá acceder al sistema.',
        itemName: mechanic.name,
        itemLabel: 'Mecánico:',
        warningMessage: 'Las órdenes de trabajo asignadas deberán ser reasignadas a otro mecánico.'
      },
      async () => {
        await this.mechanicService.deactivate(mechanic.id).toPromise();
        this.loadMechanics();
      }
    );
  }

  editMechanic(mechanic: any): void {}
  loadMechanics(): void {}
}

// ============================================
// EJEMPLO 3: COMPONENTE DE SERVICIOS
// ============================================

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html'
})
export class ServicesComponent {
  constructor(
    private serviceService: ServiceService,
    private modalService: ModalService,
    private messageService: MessageService
  ) {}

  viewService(service: any): void {
    const config = ModalService.formatServiceData(service);
    
    this.modalService.openViewModal(config, {
      onEdit: () => {
        this.modalService.closeViewModal();
        this.editService(service);
      },
      onDelete: () => {
        this.modalService.closeViewModal();
        this.confirmDeleteService(service);
      }
    });
  }

  confirmDeleteService(service: any): void {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Servicio?',
        message: 'Este servicio será eliminado del catálogo.',
        itemName: service.name,
        itemLabel: 'Servicio:',
        warningMessage: 'Este servicio no podrá ser agregado a nuevas órdenes de trabajo.'
      },
      async () => {
        try {
          await this.serviceService.delete(service.id).toPromise();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Servicio eliminado correctamente'
          });
          this.loadServices();
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el servicio'
          });
          throw error;
        }
      }
    );
  }

  editService(service: any): void {}
  loadServices(): void {}
}

// ============================================
// EJEMPLO 4: COMPONENTE DE REPUESTOS
// ============================================

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html'
})
export class PartsComponent {
  constructor(
    private partService: PartService,
    private modalService: ModalService
  ) {}

  viewPart(part: any): void {
    const config = ModalService.formatPartData(part);
    
    this.modalService.openViewModal(config, {
      onEdit: () => {
        this.modalService.closeViewModal();
        this.editPart(part);
      },
      onDelete: () => {
        this.modalService.closeViewModal();
        this.confirmDeletePart(part);
      }
    });
  }

  confirmDeletePart(part: any): void {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Repuesto?',
        message: 'El repuesto será eliminado del inventario.',
        itemName: `${part.name} (SKU: ${part.sku})`,
        itemLabel: 'Repuesto:',
        warningMessage: 'Verifica que no haya órdenes pendientes con este repuesto.'
      },
      async () => {
        await this.partService.delete(part.id).toPromise();
        this.loadParts();
      }
    );
  }

  editPart(part: any): void {}
  loadParts(): void {}
}

// ============================================
// EJEMPLO 5: MODAL PERSONALIZADO (CUSTOM)
// ============================================

@Component({
  selector: 'app-custom-entity',
  templateUrl: './custom-entity.component.html'
})
export class CustomEntityComponent {
  constructor(private modalService: ModalService) {}

  viewCustomEntity(entity: any): void {
    // Configuración completamente personalizada
    const config = {
      title: entity.title,
      subtitle: entity.subtitle,
      headerIcon: 'pi pi-star',
      headerColor: 'rgba(234, 179, 8, 0.2)', // Amarillo dorado
      sections: [
        {
          title: 'Información Principal',
          icon: 'pi pi-info-circle',
          fields: [
            {
              label: 'Nombre',
              value: entity.name,
              icon: 'pi pi-tag',
              type: 'text'
            },
            {
              label: 'Email',
              value: entity.email,
              icon: 'pi pi-envelope',
              type: 'email'
            },
            {
              label: 'Sitio Web',
              value: entity.website,
              icon: 'pi pi-globe',
              type: 'link',
              link: entity.website
            }
          ]
        },
        {
          title: 'Datos Financieros',
          icon: 'pi pi-dollar',
          fields: [
            {
              label: 'Precio',
              value: entity.price,
              icon: 'pi pi-money-bill',
              type: 'currency'
            },
            {
              label: 'Descuento',
              value: entity.discount,
              icon: 'pi pi-percentage',
              type: 'text',
              format: (value: number) => `${value}% OFF`
            },
            {
              label: 'Pagado',
              value: entity.isPaid,
              icon: 'pi pi-check-circle',
              type: 'boolean'
            }
          ]
        },
        {
          title: 'Estado y Fechas',
          icon: 'pi pi-calendar',
          fields: [
            {
              label: 'Estado',
              value: entity.status,
              type: 'badge',
              badgeClass: entity.status === 'ACTIVE' ? 'badge-success' : 'badge-danger',
              format: (value: string) => value === 'ACTIVE' ? 'Activo' : 'Inactivo'
            },
            {
              label: 'Fecha de Creación',
              value: entity.createdAt,
              icon: 'pi pi-calendar-plus',
              type: 'datetime'
            },
            {
              label: 'Última Actualización',
              value: entity.updatedAt,
              icon: 'pi pi-calendar',
              type: 'datetime'
            }
          ]
        },
        {
          title: 'Descripción Completa',
          icon: 'pi pi-file-edit',
          fields: [
            {
              label: 'Descripción',
              value: `<p>${entity.description}</p>`,
              type: 'html'
            }
          ]
        }
      ],
      showEdit: true,
      showDelete: true
    };

    this.modalService.openViewModal(config, {
      onEdit: () => {
        this.modalService.closeViewModal();
        console.log('Editar entidad personalizada');
      },
      onDelete: () => {
        this.modalService.closeViewModal();
        this.confirmDelete(entity);
      }
    });
  }

  confirmDelete(entity: any): void {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Elemento?',
        message: 'Esta acción es irreversible.',
        itemName: entity.name,
        itemLabel: 'Elemento:',
        showWarning: true,
        warningMessage: 'Todos los datos relacionados también se eliminarán.'
      },
      async () => {
        console.log('Eliminando:', entity);
        // Implementar lógica de eliminación
      }
    );
  }
}

// ============================================
// EJEMPLO 6: MODAL SIN BOTONES DE ACCIÓN
// ============================================

@Component({
  selector: 'app-readonly-view',
  templateUrl: './readonly-view.component.html'
})
export class ReadonlyViewComponent {
  constructor(private modalService: ModalService) {}

  // Modal de solo lectura (sin botones de editar/eliminar)
  viewReadonlyData(data: any): void {
    const config = {
      title: 'Información de Solo Lectura',
      subtitle: 'Estos datos no pueden ser modificados',
      headerIcon: 'pi pi-lock',
      headerColor: 'rgba(107, 114, 128, 0.2)',
      sections: [
        {
          title: 'Datos',
          icon: 'pi pi-info-circle',
          fields: [
            { label: 'Campo 1', value: data.field1, type: 'text' },
            { label: 'Campo 2', value: data.field2, type: 'text' }
          ]
        }
      ],
      showEdit: false,  // No mostrar botón de editar
      showDelete: false // No mostrar botón de eliminar
    };

    this.modalService.openViewModal(config);
  }
}

// ============================================
// EJEMPLO 7: FORMATEO PERSONALIZADO DE CAMPOS
// ============================================

@Component({
  selector: 'app-formatted-data',
  templateUrl: './formatted-data.component.html'
})
export class FormattedDataComponent {
  constructor(private modalService: ModalService) {}

  viewFormattedData(data: any): void {
    const config = {
      title: 'Datos con Formato Personalizado',
      subtitle: 'Ejemplos de formateo',
      headerIcon: 'pi pi-palette',
      headerColor: 'rgba(236, 72, 153, 0.2)',
      sections: [
        {
          title: 'Campos Formateados',
          icon: 'pi pi-sparkles',
          fields: [
            {
              label: 'Porcentaje',
              value: 85.5,
              type: 'text',
              format: (value: number) => `${value.toFixed(1)}%`
            },
            {
              label: 'Temperatura',
              value: 25,
              type: 'text',
              format: (value: number) => `${value}°C`,
              color: value > 30 ? '#ef4444' : '#10b981'
            },
            {
              label: 'Capacidad',
              value: 750,
              type: 'text',
              format: (value: number) => `${value} / 1000 MB (${(value/10).toFixed(0)}%)`
            },
            {
              label: 'Disponibilidad',
              value: true,
              type: 'badge',
              badgeClass: 'badge-success',
              format: (value: boolean) => value ? 'Disponible' : 'No Disponible'
            }
          ]
        }
      ],
      showEdit: true,
      showDelete: false
    };

    this.modalService.openViewModal(config);
  }
}

// ============================================
// TEMPLATE HTML - BOTÓN DE VER
// ============================================

/*
En tu HTML, agrega el botón para ver detalles:

<button 
  pButton 
  type="button" 
  icon="pi pi-eye" 
  class="p-button-info p-button-sm p-button-rounded" 
  (click)="viewEntity(entity)" 
  pTooltip="Ver detalles">
</button>
*/

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
1. El servicio ModalService ya está disponible globalmente
2. Solo necesitas inyectarlo en tu componente
3. Los modales se gestionan de forma centralizada
4. Las animaciones son automáticas
5. El modal de eliminación maneja el estado de carga automáticamente
6. Puedes personalizar colores, iconos y campos según necesites
7. Los formatters pre-configurados facilitan el uso con entidades comunes
8. Soporta múltiples tipos de campos (text, email, phone, date, currency, badge, etc.)
9. Responsive y con diseño moderno incluido
10. Compatible con PrimeNG y Angular standalone components
*/
