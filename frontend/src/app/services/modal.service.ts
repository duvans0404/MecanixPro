import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewSection } from '../components/shared/view-modal.component';

export interface ViewModalConfig {
  title: string;
  subtitle?: string;
  headerIcon?: string;
  headerColor?: string;
  sections: ViewSection[];
  showEdit?: boolean;
  showDelete?: boolean;
}

export interface DeleteModalConfig {
  title?: string;
  message?: string;
  itemName?: string;
  itemLabel?: string;
  showWarning?: boolean;
  warningMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // View Modal State
  private viewModalVisibleSubject = new BehaviorSubject<boolean>(false);
  public viewModalVisible$ = this.viewModalVisibleSubject.asObservable();
  
  private viewModalConfigSubject = new BehaviorSubject<ViewModalConfig | null>(null);
  public viewModalConfig$ = this.viewModalConfigSubject.asObservable();

  // Delete Modal State
  private deleteModalVisibleSubject = new BehaviorSubject<boolean>(false);
  public deleteModalVisible$ = this.deleteModalVisibleSubject.asObservable();
  
  private deleteModalConfigSubject = new BehaviorSubject<DeleteModalConfig | null>(null);
  public deleteModalConfig$ = this.deleteModalConfigSubject.asObservable();

  private deleteModalLoadingSubject = new BehaviorSubject<boolean>(false);
  public deleteModalLoading$ = this.deleteModalLoadingSubject.asObservable();

  // Callbacks
  private onEditCallback?: () => void;
  private onDeleteCallback?: () => void;
  private onDeleteConfirmCallback?: () => void | Promise<void>;

  constructor() {}

  /**
   * Open a view modal with the given configuration
   */
  openViewModal(config: ViewModalConfig, callbacks?: {
    onEdit?: () => void;
    onDelete?: () => void;
  }): void {
    this.viewModalConfigSubject.next(config);
    this.onEditCallback = callbacks?.onEdit;
    this.onDeleteCallback = callbacks?.onDelete;
    this.viewModalVisibleSubject.next(true);
  }

  /**
   * Close the view modal
   */
  closeViewModal(): void {
    this.viewModalVisibleSubject.next(false);
    setTimeout(() => {
      this.viewModalConfigSubject.next(null);
      this.onEditCallback = undefined;
      this.onDeleteCallback = undefined;
    }, 300);
  }

  /**
   * Handle edit action from view modal
   */
  handleViewModalEdit(): void {
    if (this.onEditCallback) {
      this.onEditCallback();
    }
  }

  /**
   * Handle delete action from view modal
   */
  handleViewModalDelete(): void {
    if (this.onDeleteCallback) {
      this.onDeleteCallback();
    }
  }

  /**
   * Open a delete confirmation modal
   */
  openDeleteModal(config: DeleteModalConfig, onConfirm: () => void | Promise<void>): void {
    this.deleteModalConfigSubject.next({
      title: config.title || '¿Estás seguro?',
      message: config.message || 'Esta acción no se puede deshacer.',
      itemName: config.itemName,
      itemLabel: config.itemLabel || 'Elemento a eliminar:',
      showWarning: config.showWarning !== false,
      warningMessage: config.warningMessage || 'Esta acción es permanente y no se puede revertir.'
    });
    this.onDeleteConfirmCallback = onConfirm;
    this.deleteModalVisibleSubject.next(true);
  }

  /**
   * Close the delete confirmation modal
   */
  closeDeleteModal(): void {
    this.deleteModalVisibleSubject.next(false);
    setTimeout(() => {
      this.deleteModalConfigSubject.next(null);
      this.onDeleteConfirmCallback = undefined;
      this.deleteModalLoadingSubject.next(false);
    }, 300);
  }

  /**
   * Handle delete confirmation
   */
  async handleDeleteConfirm(): Promise<void> {
    if (this.onDeleteConfirmCallback) {
      this.deleteModalLoadingSubject.next(true);
      try {
        await this.onDeleteConfirmCallback();
        this.closeDeleteModal();
      } catch (error) {
        console.error('Error during delete operation:', error);
        this.deleteModalLoadingSubject.next(false);
        // Optionally show error notification
      }
    }
  }

  /**
   * Helper method to format data for view modal
   */
  static formatClientData(client: any): ViewModalConfig {
    return {
      title: client.name || 'Cliente',
      subtitle: client.email,
      headerIcon: 'pi pi-user',
      headerColor: 'rgba(59, 130, 246, 0.2)',
      sections: [
        {
          title: 'Información Personal',
          icon: 'pi pi-user',
          fields: [
            { label: 'Nombre Completo', value: client.name, icon: 'pi pi-user', type: 'text' },
            { label: 'Tipo de Documento', value: client.documentType, icon: 'pi pi-id-card', type: 'text' },
            { label: 'Número de Documento', value: client.documentNumber, icon: 'pi pi-id-card', type: 'text' },
            { label: 'Fecha de Nacimiento', value: client.birthDate, icon: 'pi pi-calendar', type: 'date' },
          ]
        },
        {
          title: 'Información de Contacto',
          icon: 'pi pi-phone',
          fields: [
            { label: 'Email', value: client.email, icon: 'pi pi-envelope', type: 'email' },
            { label: 'Teléfono', value: client.phone, icon: 'pi pi-phone', type: 'phone' },
            { label: 'Teléfono Alternativo', value: client.alternativePhone, icon: 'pi pi-phone', type: 'phone' },
            { label: 'Dirección', value: client.address, icon: 'pi pi-map-marker', type: 'text' },
          ]
        },
        {
          title: 'Información Adicional',
          icon: 'pi pi-info-circle',
          fields: [
            { 
              label: 'Estado', 
              value: client.status === 'ACTIVE' ? 'Activo' : 'Inactivo', 
              type: 'badge',
              badgeClass: client.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'
            },
            { label: 'Cliente VIP', value: client.isVip, icon: 'pi pi-star', type: 'boolean' },
            { label: 'Notas', value: client.notes, icon: 'pi pi-file-edit', type: 'text' },
          ]
        }
      ],
      showEdit: true,
      showDelete: true
    };
  }

  static formatVehicleData(vehicle: any): ViewModalConfig {
    return {
      title: `${vehicle.brand} ${vehicle.model}`,
      subtitle: vehicle.plate,
      headerIcon: 'pi pi-car',
      headerColor: 'rgba(16, 185, 129, 0.2)',
      sections: [
        {
          title: 'Información del Vehículo',
          icon: 'pi pi-car',
          fields: [
            { label: 'Marca', value: vehicle.brand, icon: 'pi pi-tag', type: 'text' },
            { label: 'Modelo', value: vehicle.model, icon: 'pi pi-tag', type: 'text' },
            { label: 'Año', value: vehicle.year, icon: 'pi pi-calendar', type: 'text' },
            { label: 'Placa', value: vehicle.plate, icon: 'pi pi-id-card', type: 'text' },
            { label: 'Color', value: vehicle.color, icon: 'pi pi-palette', type: 'text' },
            { label: 'VIN', value: vehicle.vin, icon: 'pi pi-hashtag', type: 'text' },
          ]
        },
        {
          title: 'Detalles Técnicos',
          icon: 'pi pi-cog',
          fields: [
            { label: 'Tipo de Combustible', value: vehicle.fuelType, icon: 'pi pi-bolt', type: 'text' },
            { label: 'Transmisión', value: vehicle.transmission, icon: 'pi pi-cog', type: 'text' },
            { label: 'Kilometraje', value: vehicle.mileage ? `${vehicle.mileage} km` : null, icon: 'pi pi-chart-line', type: 'text' },
          ]
        }
      ],
      showEdit: true,
      showDelete: true
    };
  }

  static formatMechanicData(mechanic: any): ViewModalConfig {
    return {
      title: mechanic.name || 'Mecánico',
      subtitle: mechanic.specialization,
      headerIcon: 'pi pi-wrench',
      headerColor: 'rgba(245, 158, 11, 0.2)',
      sections: [
        {
          title: 'Información Personal',
          icon: 'pi pi-user',
          fields: [
            { label: 'Nombre Completo', value: mechanic.name, icon: 'pi pi-user', type: 'text' },
            { label: 'Email', value: mechanic.email, icon: 'pi pi-envelope', type: 'email' },
            { label: 'Teléfono', value: mechanic.phone, icon: 'pi pi-phone', type: 'phone' },
          ]
        },
        {
          title: 'Información Profesional',
          icon: 'pi pi-briefcase',
          fields: [
            { label: 'Especialización', value: mechanic.specialization, icon: 'pi pi-wrench', type: 'text' },
            { label: 'Nivel de Experiencia', value: mechanic.experienceLevel, icon: 'pi pi-star', type: 'text' },
            { label: 'Certificaciones', value: mechanic.certifications, icon: 'pi pi-verified', type: 'text' },
            { 
              label: 'Estado', 
              value: mechanic.status === 'ACTIVE' ? 'Activo' : 'Inactivo', 
              type: 'badge',
              badgeClass: mechanic.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'
            },
          ]
        }
      ],
      showEdit: true,
      showDelete: true
    };
  }

  static formatServiceData(service: any): ViewModalConfig {
    return {
      title: service.name || 'Servicio',
      subtitle: service.description,
      headerIcon: 'pi pi-cog',
      headerColor: 'rgba(139, 92, 246, 0.2)',
      sections: [
        {
          title: 'Información del Servicio',
          icon: 'pi pi-info-circle',
          fields: [
            { label: 'Nombre', value: service.name, icon: 'pi pi-tag', type: 'text' },
            { label: 'Descripción', value: service.description, icon: 'pi pi-file-edit', type: 'text' },
            { label: 'Categoría', value: service.category, icon: 'pi pi-folder', type: 'text' },
            { label: 'Precio', value: service.price, icon: 'pi pi-dollar', type: 'currency' },
            { label: 'Duración Estimada', value: service.estimatedDuration ? `${service.estimatedDuration} min` : null, icon: 'pi pi-clock', type: 'text' },
            { 
              label: 'Estado', 
              value: service.isActive ? 'Activo' : 'Inactivo', 
              type: 'badge',
              badgeClass: service.isActive ? 'badge-success' : 'badge-danger'
            },
          ]
        }
      ],
      showEdit: true,
      showDelete: true
    };
  }

  static formatPartData(part: any): ViewModalConfig {
    return {
      title: part.name || 'Repuesto',
      subtitle: `SKU: ${part.sku}`,
      headerIcon: 'pi pi-box',
      headerColor: 'rgba(236, 72, 153, 0.2)',
      sections: [
        {
          title: 'Información del Repuesto',
          icon: 'pi pi-info-circle',
          fields: [
            { label: 'Nombre', value: part.name, icon: 'pi pi-tag', type: 'text' },
            { label: 'SKU', value: part.sku, icon: 'pi pi-hashtag', type: 'text' },
            { label: 'Descripción', value: part.description, icon: 'pi pi-file-edit', type: 'text' },
            { label: 'Marca', value: part.brand, icon: 'pi pi-tag', type: 'text' },
            { label: 'Categoría', value: part.category, icon: 'pi pi-folder', type: 'text' },
          ]
        },
        {
          title: 'Inventario y Precio',
          icon: 'pi pi-database',
          fields: [
            { label: 'Stock Disponible', value: part.stockQuantity, icon: 'pi pi-box', type: 'text' },
            { label: 'Stock Mínimo', value: part.minStockLevel, icon: 'pi pi-exclamation-triangle', type: 'text' },
            { label: 'Precio de Compra', value: part.purchasePrice, icon: 'pi pi-dollar', type: 'currency' },
            { label: 'Precio de Venta', value: part.salePrice, icon: 'pi pi-dollar', type: 'currency' },
            { label: 'Ubicación', value: part.location, icon: 'pi pi-map-marker', type: 'text' },
          ]
        }
      ],
      showEdit: true,
      showDelete: true
    };
  }

  static formatWorkOrderData(workOrder: any): ViewModalConfig {
    return {
      title: `Orden #${workOrder.id}`,
      subtitle: workOrder.description || '',
      headerIcon: 'pi pi-wrench',
      headerColor: 'rgba(245, 158, 11, 0.2)',
      sections: [
        {
          title: 'Datos Generales',
          icon: 'pi pi-info-circle',
          fields: [
            { label: 'Cliente', value: workOrder.clientName, icon: 'pi pi-user', type: 'text' },
            { label: 'Vehículo', value: workOrder.vehicleInfo, icon: 'pi pi-car', type: 'text' },
            { label: 'Mecánico', value: workOrder.mechanicName, icon: 'pi pi-wrench', type: 'text' },
            { label: 'Servicio', value: workOrder.serviceName, icon: 'pi pi-cog', type: 'text' },
            { label: 'Estado', value: workOrder.status, icon: 'pi pi-circle-fill', type: 'badge', badgeClass: workOrder.status === 'completed' ? 'badge-success' : (workOrder.status === 'pending' ? 'badge-info' : 'badge-warning') },
            { label: 'Prioridad', value: workOrder.priority, icon: 'pi pi-exclamation-triangle', type: 'badge', badgeClass: workOrder.priority === 'high' ? 'badge-danger' : 'badge-info' },
          ]
        },
        {
          title: 'Costos y Horas',
          icon: 'pi pi-dollar',
          fields: [
            { label: 'Mano de Obra', value: workOrder.laborCost, icon: 'pi pi-dollar', type: 'currency' },
            { label: 'Repuestos', value: workOrder.partsCost, icon: 'pi pi-box', type: 'currency' },
            { label: 'Total', value: workOrder.totalCost, icon: 'pi pi-dollar', type: 'currency' },
            { label: 'Horas Estimadas', value: workOrder.estimatedHours, icon: 'pi pi-clock', type: 'text' },
            { label: 'Horas Reales', value: workOrder.actualHours, icon: 'pi pi-clock', type: 'text' },
          ]
        },
        {
          title: 'Fechas y Notas',
          icon: 'pi pi-calendar',
          fields: [
            { label: 'Fecha de Inicio', value: workOrder.startDate, icon: 'pi pi-calendar-plus', type: 'date' },
            { label: 'Fecha de Fin', value: workOrder.endDate, icon: 'pi pi-calendar-times', type: 'date' },
            { label: 'Notas', value: workOrder.notes, icon: 'pi pi-file', type: 'text' },
          ]
        }
      ],
      showEdit: true,
      showDelete: true
    };
  }
}
