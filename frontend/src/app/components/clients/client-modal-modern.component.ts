import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Client } from '../../models/client.model';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-modal-modern',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-modal-modern.component.html',
  styleUrls: ['./client-modal-modern.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(50px) scale(0.95)' 
        }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0) scale(1)' 
          })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-in', 
          style({ 
            opacity: 0, 
            transform: 'translateY(30px) scale(0.95)' 
          })
        )
      ])
    ])
  ]
})
export class ClientModalModernComponent implements OnInit, OnDestroy {
  @Input() isVisible: boolean = false;
  @Input() clientData: Client | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Client>();

  clientForm!: FormGroup;
  isLoading: boolean = false;
  avatarPreview: string | null = null;
  defaultAvatar: string = '/assets/images/default-avatar.svg';
  
  get isCreating(): boolean {
    return !this.clientData;
  }

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService
  ) {
    this.initializeForm();
    this.setupKeyboardShortcuts();
  }

  ngOnInit(): void {
    if (this.clientData) {
      this.populateForm();
    }
  }

  ngOnDestroy(): void {
    this.removeKeyboardShortcuts();
  }

  private initializeForm(): void {
    this.clientForm = this.formBuilder.group({
      // Personal Information
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      documentType: [''],
      documentNumber: [''],
      birthDate: [''],
      
      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      alternativePhone: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      
      // Additional Information
      status: ['ACTIVE'],
      isVip: [false],
      notes: [''],
      
      // Emergency Contact
      emergencyContactName: [''],
      emergencyContactPhone: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]],
      emergencyContactRelation: ['']
    });
  }

  private populateForm(): void {
    if (this.clientData) {
      this.clientForm.patchValue({
        name: this.clientData.name,
        documentType: this.clientData.documentType,
        documentNumber: this.clientData.documentNumber,
        birthDate: this.clientData.birthDate ? this.formatDateForInput(this.clientData.birthDate) : '',
        email: this.clientData.email,
        phone: this.clientData.phone,
        alternativePhone: this.clientData.alternativePhone,
        address: this.clientData.address,
        status: this.clientData.status || 'ACTIVE',
        isVip: this.clientData.isVip || false,
        notes: this.clientData.notes,
        emergencyContactName: this.clientData.emergencyContactName,
        emergencyContactPhone: this.clientData.emergencyContactPhone,
        emergencyContactRelation: this.clientData.emergencyContactRelation
      });

      // Set avatar preview if client has avatar
      if (this.clientData.avatar) {
        this.avatarPreview = this.clientData.avatar;
      }
    }
  }

  private formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onPhotoSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB.');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.avatarPreview = null;
    // Reset file input
    const fileInput = document.querySelector('.photo-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    if (this.isLoading) {
      return; // Prevent closing while saving
    }
    
    this.resetForm();
    this.onClose.emit();
  }

  async onSubmit(): Promise<void> {
    if (this.clientForm.invalid || this.isLoading) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;

    try {
      const formData = this.clientForm.value;
      
      // Prepare client data
      const clientData: Partial<Client> = {
        name: formData.name.trim(),
        documentType: formData.documentType,
        documentNumber: formData.documentNumber?.trim(),
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        alternativePhone: formData.alternativePhone?.trim(),
        address: formData.address.trim(),
        status: formData.status,
        isVip: formData.isVip,
        notes: formData.notes?.trim(),
        emergencyContactName: formData.emergencyContactName?.trim(),
        emergencyContactPhone: formData.emergencyContactPhone?.trim(),
        emergencyContactRelation: formData.emergencyContactRelation,
        avatar: this.avatarPreview
      };

      let savedClient: Client;

      if (this.isCreating) {
        // Create new client
        const created = await this.clientService.create(clientData as Omit<Client, 'id'>).toPromise();
        savedClient = created ?? (clientData as Client);
        this.showSuccessMessage('Cliente creado exitosamente');
      } else {
        // Update existing client
        const updated = await this.clientService.update(this.clientData!.id, clientData).toPromise();
        savedClient = updated ?? (clientData as Client);
        this.showSuccessMessage('Cliente actualizado exitosamente');
      }

      // Emit success event
      this.onSave.emit(savedClient);
      
      // Close modal
      setTimeout(() => {
        this.close();
      }, 500);

    } catch (error) {
      console.error('Error saving client:', error);
      this.showErrorMessage(
        this.isCreating 
          ? 'Error al crear el cliente. Por favor intenta nuevamente.' 
          : 'Error al actualizar el cliente. Por favor intenta nuevamente.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }

  private resetForm(): void {
    this.clientForm.reset({
      status: 'ACTIVE',
      isVip: false
    });
    this.avatarPreview = null;
    this.clientData = null;
  }

  private showSuccessMessage(message: string): void {
    // Implementation depends on your notification system
    // You could use a toast service, alert, or custom notification component
    console.log('Success:', message);
    // Example with browser notification:
    // this.notificationService.success(message);
  }

  private showErrorMessage(message: string): void {
    // Implementation depends on your notification system
    console.error('Error:', message);
    // Example with browser notification:
    // this.notificationService.error(message);
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private removeKeyboardShortcuts(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isVisible) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      
      case 'Enter':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.onSubmit();
        }
        break;
    }
  };

  // Utility methods for template
  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      const errors = field.errors;
      
      if (errors['required']) {
        return 'Este campo es requerido';
      }
      if (errors['email']) {
        return 'Formato de email inválido';
      }
      if (errors['pattern']) {
        return 'Formato inválido';
      }
      if (errors['minlength']) {
        return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
      if (errors['maxlength']) {
        return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  // Form validation helpers
  get nameInvalid(): boolean {
    return this.isFieldInvalid('name');
  }

  get emailInvalid(): boolean {
    return this.isFieldInvalid('email');
  }

  get phoneInvalid(): boolean {
    return this.isFieldInvalid('phone');
  }

  get addressInvalid(): boolean {
    return this.isFieldInvalid('address');
  }

  // Status badge helper
  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'badge-success';
      case 'INACTIVE':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  // Document type display helper
  getDocumentTypeDisplay(type: string): string {
    const types: { [key: string]: string } = {
      'cc': 'Cédula de Ciudadanía',
      'ti': 'Tarjeta de Identidad', 
      'ce': 'Cédula de Extranjería',
      'pp': 'Pasaporte'
    };
    return types[type] || type;
  }

  // Relationship display helper
  getRelationshipDisplay(relation: string): string {
    const relations: { [key: string]: string } = {
      'spouse': 'Cónyuge',
      'parent': 'Padre/Madre',
      'sibling': 'Hermano/a',
      'child': 'Hijo/a',
      'friend': 'Amigo/a',
      'other': 'Otro'
    };
    return relations[relation] || relation;
  }
}