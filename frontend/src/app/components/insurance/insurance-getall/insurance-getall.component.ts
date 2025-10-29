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
import { InsuranceService } from '../../../services/insurance.service';
import { Insurance } from '../../../models/insurance.model';
import { TagSeverity } from '../../../models/ui.model';

@Component({
  selector: 'app-insurance-getall',
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
  
  templateUrl: './insurance-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class InsuranceGetallComponent implements OnInit {
  insurances: Insurance[] = [];
  filteredInsurances: Insurance[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  coverageFilter: string = 'all';
  loading: boolean = false;

  statusOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Vigentes', value: 'active' },
    { label: 'Vencidos', value: 'expired' }
  ];

  coverageOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Completa', value: 'full' },
    { label: 'Responsabilidad Civil', value: 'liability' },
    { label: 'Colisión', value: 'collision' },
    { label: 'Comprensiva', value: 'comprehensive' }
  ];

  constructor(
    private insuranceService: InsuranceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadInsurances();
  }

  loadInsurances() {
    this.loading = true;
    this.insuranceService.getInsurances().subscribe({
      next: (insurances) => {
        this.insurances = insurances;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando seguros:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los seguros'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredInsurances = this.insurances.filter(insurance => {
      const matchesSearch = !this.searchTerm || 
        insurance.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        insurance.policyNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getCoverageTypeText(insurance.coverageType).toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && !this.isExpired(insurance.endDate)) ||
        (this.statusFilter === 'expired' && this.isExpired(insurance.endDate));
      
      const matchesCoverage = this.coverageFilter === 'all' || 
        insurance.coverageType === this.coverageFilter;
      
      return matchesSearch && matchesStatus && matchesCoverage;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onCoverageFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.coverageFilter = 'all';
    this.applyFilters();
  }

  editInsurance(id: number) {
    this.router.navigate(['/insurance/update', id]);
  }

  deleteInsurance(id: number) {
    const insurance = this.insurances.find(i => i.id === id);
    const insuranceName = insurance ? insurance.companyName : 'este seguro';
    
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar ${insuranceName}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.insuranceService.deleteInsurance(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Seguro eliminado correctamente'
            });
            this.loadInsurances();
          },
          error: (error) => {
            console.error('Error eliminando seguro:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el seguro'
            });
          }
        });
      }
    });
  }

  createInsurance() {
    this.router.navigate(['/insurance/create']);
  }

  getCoverageTypeText(type: string): string {
    switch (type) {
      case 'full': return 'Completa';
      case 'liability': return 'Responsabilidad Civil';
      case 'collision': return 'Colisión';
      case 'comprehensive': return 'Comprensiva';
      default: return type;
    }
  }

  isExpired(endDate: Date): boolean {
    return new Date(endDate) < new Date();
  }

  getStatusSeverity(endDate: Date): TagSeverity {
    return this.isExpired(endDate) ? 'danger' : 'success';
  }

  getStatusText(endDate: Date): string {
    return this.isExpired(endDate) ? 'Vencido' : 'Vigente';
  }
}