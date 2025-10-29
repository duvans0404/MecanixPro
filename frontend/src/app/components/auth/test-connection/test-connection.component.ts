import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-test-connection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h2>Test de Conectividad</h2>
      
      <button (click)="testBackend()" [disabled]="loading" style="margin: 10px; padding: 10px 20px;">
        {{ loading ? 'Probando...' : 'Probar Backend' }}
      </button>
      
      <div *ngIf="result" style="margin-top: 20px; padding: 15px; border-radius: 8px;"
           [style.background-color]="result.success ? '#d4edda' : '#f8d7da'"
           [style.color]="result.success ? '#155724' : '#721c24'">
        <h3>{{ result.success ? 'Éxito' : 'Error' }}</h3>
        <pre>{{ result.message }}</pre>
        <div *ngIf="result.details" style="margin-top: 10px;">
          <strong>Detalles:</strong>
          <pre>{{ result.details | json }}</pre>
        </div>
      </div>
    </div>
  `
})
export class TestConnectionComponent {
  private http = inject(HttpClient);
  loading = false;
  result: { success: boolean; message: string; details?: any } | null = null;

  testBackend() {
    this.loading = true;
    this.result = null;

    console.log('Testing backend connection...');
    
    // Test simple del backend
    this.http.post('/api/auth/login', { username: 'test', password: 'test' }).subscribe({
      next: (response) => {
        this.result = {
          success: true,
          message: 'Backend respondió correctamente (aunque credenciales sean incorrectas)',
          details: response
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Backend error:', error);
        
        if (error.status === 0) {
          this.result = {
            success: false,
            message: 'No se puede conectar al backend. Error de red o CORS.',
            details: error
          };
        } else if (error.status >= 400 && error.status < 500) {
          this.result = {
            success: true,
            message: `Backend respondió con error ${error.status} (esto es esperado con credenciales de prueba)`,
            details: error.error
          };
        } else {
          this.result = {
            success: false,
            message: `Error del servidor: ${error.status}`,
            details: error
          };
        }
        this.loading = false;
      }
    });
  }
}