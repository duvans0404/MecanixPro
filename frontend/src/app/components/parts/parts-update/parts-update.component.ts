import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PartService } from '../../../services/part.service';
import { Part } from '../../../models/part.model';

@Component({
  selector: 'app-parts-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './parts-update.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PartsUpdateComponent implements OnInit {
  partForm: FormGroup;
  part: Part | null = null;
  loading: boolean = false;
  partId: string = '';

  constructor(
    private fb: FormBuilder,
    private partService: PartService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.partForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      partNumber: ['', [Validators.required, Validators.minLength(3)]],
      brand: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      active: [true]
    });
  }

  ngOnInit() {
    this.partId = this.route.snapshot.paramMap.get('id') || '';
    if (this.partId) {
      this.loadPart();
    }
  }

  loadPart() {
    this.loading = true;
    this.partService.getPart(this.partId).subscribe({
      next: (part) => {
        if (part) {
          this.part = part;
          this.partForm.patchValue({
            name: part.name,
            description: part.description,
            partNumber: part.partNumber,
            brand: part.brand,
            price: part.price,
            stock: part.stock,
            active: part.active
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando repuesto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el repuesto'
        });
        this.loading = false;
        this.router.navigate(['/parts']);
      }
    });
  }

  onSubmit() {
    if (this.partForm.valid && this.part) {
      this.loading = true;
      const partData = this.partForm.value;
      
      this.partService.updatePart(this.partId, partData).subscribe({
        next: (part) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Repuesto actualizado correctamente'
          });
          this.loading = false;
          this.router.navigate(['/parts']);
        },
        error: (error) => {
          console.error('Error actualizando repuesto:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el repuesto'
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor, completa todos los campos requeridos correctamente'
      });
    }
  }

  onCancel() {
    this.router.navigate(['/parts']);
  }

  markFormGroupTouched() {
    Object.keys(this.partForm.controls).forEach(key => {
      const control = this.partForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.partForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor o igual a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nombre',
      description: 'Descripción',
      partNumber: 'Número de Parte',
      brand: 'Marca',
      price: 'Precio',
      stock: 'Stock'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.partForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}
