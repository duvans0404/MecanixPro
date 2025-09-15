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
import { MechanicService } from '../../../services/mechanic.service';
import { Mechanic } from '../../../models/mechanic.model';

@Component({
  selector: 'app-mechanic-getall',
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
  providers: [ConfirmationService, MessageService],
  templateUrl: './mechanic-getall.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MechanicGetallComponent implements OnInit {
  mechanics: Mechanic[] = [];
  filteredMechanics: Mechanic[] = [];
  searchTerm: string = '';
  availabilityFilter: string = 'all';
  specializationFilter: string = 'all';
  loading: boolean = false;

  availabilityOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Disponibles', value: 'available' },
    { label: 'No Disponibles', value: 'unavailable' }
  ];

  specializationOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Motor', value: 'engine' },
    { label: 'Transmisión', value: 'transmission' },
    { label: 'Frenos', value: 'brakes' },
    { label: 'Eléctrico', value: 'electrical' },
    { label: 'Aire Acondicionado', value: 'air-conditioning' },
    { label: 'General', value: 'general' }
  ];

  constructor(
    private mechanicService: MechanicService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadMechanics();
  }

  loadMechanics() {
    this.loading = true;
    this.mechanicService.getMechanics().subscribe({
      next: (mechanics) => {
        this.mechanics = mechanics;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando mecánicos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los mecánicos'
        });
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredMechanics = this.mechanics.filter(mechanic => {
      const matchesSearch = !this.searchTerm || 
        mechanic.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mechanic.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mechanic.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getSpecializationText(mechanic.specialization).toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesAvailability = this.availabilityFilter === 'all' || 
        (this.availabilityFilter === 'available' && mechanic.isAvailable) ||
        (this.availabilityFilter === 'unavailable' && !mechanic.isAvailable);
      
      const matchesSpecialization = this.specializationFilter === 'all' || 
        mechanic.specialization === this.specializationFilter;
      
      return matchesSearch && matchesAvailability && matchesSpecialization;
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onAvailabilityFilterChange() {
    this.applyFilters();
  }

  onSpecializationFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.availabilityFilter = 'all';
    this.specializationFilter = 'all';
    this.applyFilters();
  }

  editMechanic(id: number) {
    this.router.navigate(['/mechanics/update', id]);
  }

  deleteMechanic(id: number) {
    const mechanic = this.mechanics.find(m => m.id === id);
    const mechanicName = mechanic ? `${mechanic.firstName} ${mechanic.lastName}` : 'este mecánico';
    
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar ${mechanicName}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.mechanicService.deleteMechanic(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Mecánico eliminado correctamente'
            });
            this.loadMechanics();
          },
          error: (error) => {
            console.error('Error eliminando mecánico:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el mecánico'
            });
          }
        });
      }
    });
  }

  createMechanic() {
    this.router.navigate(['/mechanics/create']);
  }

  getSpecializationText(specialization: string): string {
    switch (specialization) {
      case 'engine': return 'Motor';
      case 'transmission': return 'Transmisión';
      case 'brakes': return 'Frenos';
      case 'electrical': return 'Eléctrico';
      case 'air-conditioning': return 'Aire Acondicionado';
      case 'general': return 'General';
      default: return specialization;
    }
  }

  getAvailabilitySeverity(isAvailable: boolean): string {
    return isAvailable ? 'success' : 'danger';
  }

  getAvailabilityText(isAvailable: boolean): string {
    return isAvailable ? 'Disponible' : 'No Disponible';
  }
}