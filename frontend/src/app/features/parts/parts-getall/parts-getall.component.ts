import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PartService } from '../../../core/services/part.service';
import { Part } from '../../../shared/models/part.model';
import { TagSeverity } from '../../../shared/models/ui.model';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-parts-getall',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    TagModule
  ],
  
  templateUrl: './parts-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PartsGetallComponent implements OnInit {
  parts: Part[] = [];
  filteredParts: Part[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  stockFilter: string = 'all';
  loading: boolean = false;

  statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' }
  ];

  stockOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'En Stock', value: 'in-stock' },
    { label: 'Bajo Stock', value: 'low-stock' },
    { label: 'Sin Stock', value: 'out-of-stock' }
  ];

  constructor(
    private partService: PartService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadParts();
  }

  loadParts() {
    this.loading = true;
    this.partService.getParts().subscribe({
      next: (parts) => {
        this.parts = parts;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error cargando repuestos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los repuestos'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredParts = this.parts.filter(part => {
      const matchesSearch = !this.searchTerm || 
        part.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        part.partNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        part.brand.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && part.active) ||
        (this.statusFilter === 'inactive' && !part.active);
      
      const matchesStock = this.stockFilter === 'all' || 
        (this.stockFilter === 'in-stock' && part.stock > 10) ||
        (this.stockFilter === 'low-stock' && part.stock > 0 && part.stock <= 10) ||
        (this.stockFilter === 'out-of-stock' && part.stock === 0);
      
      return matchesSearch && matchesStatus && matchesStock;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onStockFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.stockFilter = 'all';
    this.applyFilters();
  }

  editPart(part: Part) {
    this.router.navigate(['/parts/update', part.id]);
  }

  viewPart(part: Part) {
    const config = ModalService.formatPartData(part);
    config.headerColor = 'rgba(239, 68, 68, 0.2)';
    config.title = 'Ver Detalle del Repuesto';
    this.modalService.openViewModal(config);
  }

  confirmDeletePart(part: Part) {
    this.modalService.openDeleteModal(
      {
        title: '¿Eliminar Repuesto?',
        message: 'Esta acción no se puede deshacer. El repuesto será eliminado permanentemente.',
        itemName: `${part.name} (${part.partNumber})`,
        itemLabel: 'Repuesto a eliminar:',
        showWarning: true,
        warningMessage: '⚠️ Se perderá toda la información relacionada con este repuesto.'
      },
      () => this.executeDeletePart(part.id)
    );
  }

  private executeDeletePart(partId: number) {
    this.partService.deletePart(partId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Repuesto eliminado correctamente'
        });
        this.loadParts();
      },
      error: (error: any) => {
        console.error('Error eliminando repuesto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el repuesto'
        });
      }
    });
  }

  deletePart(part: Part) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el repuesto "${part.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
        accept: () => {
          this.partService.deletePart(part.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Repuesto eliminado correctamente'
            });
            this.loadParts();
          },
          error: (error: any) => {
            console.error('Error eliminando repuesto:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el repuesto'
            });
          }
        });
      }
    });
  }

  createPart() {
    this.router.navigate(['/parts/create']);
  }

  getStatusSeverity(active: boolean): TagSeverity {
    return active ? 'success' : 'danger';
  }

  getStatusLabel(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  getStockSeverity(stock: number): TagSeverity {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warn';
    return 'success';
  }

  getStockLabel(stock: number): string {
    if (stock === 0) return 'Sin Stock';
    if (stock <= 10) return 'Bajo Stock';
    return 'En Stock';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
