import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';

export interface ViewField {
  label: string;
  value: any;
  type?: 'text' | 'email' | 'phone' | 'date' | 'datetime' | 'currency' | 'badge' | 'image' | 'html' | 'boolean' | 'link';
  icon?: string;
  color?: string;
  badgeClass?: string;
  link?: string;
  format?: (value: any) => string;
}

export interface ViewSection {
  title: string;
  icon?: string;
  fields: ViewField[];
}

@Component({
  selector: 'app-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="visible" @fadeIn (click)="onBackdropClick($event)">
      <div class="modal-container" @slideUp (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="icon-wrapper" [style.background]="headerColor">
              <i [class]="headerIcon"></i>
            </div>
            <div>
              <h2 class="modal-title">{{ title }}</h2>
              <p class="modal-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <button class="close-btn" (click)="close()" aria-label="Cerrar">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-body">
          <div class="sections-container">
            <div class="section" *ngFor="let section of sections; let i = index" 
                 [@slideInLeft]="i"
                 [style.animation-delay.ms]="i * 50">
              <div class="section-header" *ngIf="section.title">
                <i [class]="section.icon || 'pi pi-info-circle'" class="section-icon"></i>
                <h3 class="section-title">{{ section.title }}</h3>
              </div>
              
              <div class="fields-grid">
                <div class="field-item" *ngFor="let field of section.fields; let j = index"
                     [class.full-width]="field.type === 'html'"
                     [@fadeInUp]="j"
                     [style.animation-delay.ms]="(i * section.fields.length + j) * 30">
                  <div class="field-label">
                    <i [class]="field.icon || 'pi pi-circle-fill'" 
                       [style.color]="field.color || 'var(--primary-color)'"></i>
                    <span>{{ field.label }}</span>
                  </div>
                  
                  <div class="field-value" [ngSwitch]="field.type || 'text'">
                    <!-- Text -->
                    <span *ngSwitchCase="'text'" class="value-text">
                      {{ field.format ? field.format(field.value) : (field.value || '—') }}
                    </span>
                    
                    <!-- Email -->
                    <a *ngSwitchCase="'email'" [href]="'mailto:' + field.value" class="value-link">
                      <i class="pi pi-envelope"></i>
                      {{ field.value || '—' }}
                    </a>
                    
                    <!-- Phone -->
                    <a *ngSwitchCase="'phone'" [href]="'tel:' + field.value" class="value-link">
                      <i class="pi pi-phone"></i>
                      {{ field.value || '—' }}
                    </a>
                    
                    <!-- Date -->
                    <span *ngSwitchCase="'date'" class="value-date">
                      <i class="pi pi-calendar"></i>
                      {{ field.value ? (field.value | date: 'dd/MM/yyyy') : '—' }}
                    </span>
                    
                    <!-- DateTime -->
                    <span *ngSwitchCase="'datetime'" class="value-date">
                      <i class="pi pi-calendar-clock"></i>
                      {{ field.value ? (field.value | date: 'dd/MM/yyyy HH:mm') : '—' }}
                    </span>
                    
                    <!-- Currency -->
                    <span *ngSwitchCase="'currency'" class="value-currency">
                      <i class="pi pi-dollar"></i>
                      {{ field.value ? (field.value | currency: 'USD':'symbol':'1.2-2') : '—' }}
                    </span>
                    
                    <!-- Badge -->
                    <span *ngSwitchCase="'badge'" 
                          [class]="'value-badge ' + (field.badgeClass || 'badge-default')">
                      {{ field.format ? field.format(field.value) : field.value }}
                    </span>
                    
                    <!-- Boolean -->
                    <span *ngSwitchCase="'boolean'" class="value-boolean">
                      <i [class]="field.value ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                         [style.color]="field.value ? 'var(--success-color)' : 'var(--danger-color)'"></i>
                      {{ field.value ? 'Sí' : 'No' }}
                    </span>
                    
                    <!-- Image -->
                    <img *ngSwitchCase="'image'" 
                         [src]="field.value || '/assets/images/default-avatar.svg'" 
                         [alt]="field.label"
                         class="value-image"
                         (error)="onImageError($event)">
                    
                    <!-- Link -->
                    <a *ngSwitchCase="'link'" [href]="field.link || field.value" 
                       target="_blank" class="value-link">
                      <i class="pi pi-external-link"></i>
                      {{ field.format ? field.format(field.value) : field.value }}
                    </a>
                    
                    <!-- HTML -->
                    <div *ngSwitchCase="'html'" [innerHTML]="field.value" class="value-html"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button *ngIf="onEdit.observed" class="btn btn-primary" (click)="edit()">
            <i class="pi pi-pencil"></i>
            <span>Editar</span>
          </button>
          <button *ngIf="onDelete.observed" class="btn btn-danger" (click)="delete()">
            <i class="pi pi-trash"></i>
            <span>Eliminar</span>
          </button>
          <button class="btn btn-secondary" (click)="close()">
            <i class="pi pi-times"></i>
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-container {
      background: white;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .modal-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-20px, 20px) scale(1.1); }
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      position: relative;
      z-index: 1;
    }

    .icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .icon-wrapper i {
      font-size: 2rem;
      color: white;
    }

    .modal-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .modal-subtitle {
      font-size: 0.95rem;
      margin: 0.25rem 0 0;
      opacity: 0.95;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    .close-btn i {
      font-size: 1.25rem;
    }

    /* Body */
    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
    }

    .sections-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .section:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .section-icon {
      font-size: 1.25rem;
      color: #667eea;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .fields-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .field-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field-item.full-width {
      grid-column: 1 / -1;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .field-label i {
      font-size: 0.5rem;
    }

    .field-value {
      font-size: 1rem;
      color: #1f2937;
      font-weight: 500;
    }

    .value-text {
      word-break: break-word;
    }

    .value-link {
      color: #3b82f6;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .value-link:hover {
      color: #2563eb;
      text-decoration: underline;
    }

    .value-link i {
      font-size: 0.875rem;
    }

    .value-date {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
    }

    .value-date i {
      color: #3b82f6;
    }

    .value-currency {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #059669;
      font-weight: 600;
    }

    .value-currency i {
      color: #10b981;
    }

    .value-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge-info {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-default {
      background: #f3f4f6;
      color: #374151;
    }

    .value-boolean {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
    }

    .value-boolean i {
      font-size: 1.25rem;
    }

    .value-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 12px;
      border: 3px solid #e5e7eb;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .value-html {
      line-height: 1.6;
      color: #4b5563;
    }

    /* Footer */
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9375rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #5568d3 0%, #63408a 100%);
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .btn-danger:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    /* Scrollbar */
    .modal-body::-webkit-scrollbar {
      width: 8px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .modal-container {
        border-radius: 16px;
        max-height: 95vh;
      }

      .modal-header {
        padding: 1.5rem;
      }

      .icon-wrapper {
        width: 56px;
        height: 56px;
      }

      .modal-title {
        font-size: 1.5rem;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .fields-grid {
        grid-template-columns: 1fr;
      }

      .modal-footer {
        flex-wrap: wrap;
      }

      .btn {
        flex: 1;
        justify-content: center;
      }
    }
  `],
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
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateX(-30px)' 
        }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateX(0)' 
          })
        )
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(20px)' 
        }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0)' 
          })
        )
      ])
    ])
  ]
})
export class ViewModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() title: string = 'Detalles';
  @Input() subtitle?: string;
  @Input() headerIcon: string = 'pi pi-eye';
  @Input() headerColor: string = 'rgba(255, 255, 255, 0.2)';
  @Input() sections: ViewSection[] = [];
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.visible) {
      document.body.style.overflow = 'hidden';
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    document.body.style.overflow = 'auto';
    this.onClose.emit();
  }

  edit(): void {
    this.onEdit.emit();
  }

  delete(): void {
    this.onDelete.emit();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/default-avatar.svg';
  }
}
