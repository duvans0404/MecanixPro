import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="visible" @fadeIn (click)="onBackdropClick($event)">
      <div class="modal-container" @bounceIn (click)="$event.stopPropagation()">
        <!-- Animated Icon -->
        <div class="icon-container">
          <div class="warning-icon-wrapper" @pulse>
            <div class="warning-icon-bg"></div>
            <i class="pi pi-exclamation-triangle warning-icon"></i>
          </div>
          <div class="particles">
            <div class="particle" *ngFor="let i of [1,2,3,4,5,6,7,8]" 
                 [style.--i]="i"></div>
          </div>
        </div>

        <!-- Content -->
        <div class="modal-content">
          <h2 class="modal-title" @fadeInDown>{{ title }}</h2>
          <p class="modal-message" @fadeInDown>{{ message }}</p>
          
          <div class="info-box" *ngIf="itemName" @slideInUp>
            <i class="pi pi-info-circle"></i>
            <div>
              <span class="info-label">{{ itemLabel }}</span>
              <strong class="info-value">{{ itemName }}</strong>
            </div>
          </div>

          <div class="warning-message" *ngIf="showWarning" @slideInUp>
            <i class="pi pi-shield"></i>
            <p>{{ warningMessage }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions" @fadeInUp>
          <button class="btn btn-cancel" (click)="cancel()" [disabled]="isDeleting">
            <i class="pi pi-times"></i>
            <span>Cancelar</span>
          </button>
          <button class="btn btn-delete" (click)="confirm()" [disabled]="isDeleting">
            <div class="spinner" *ngIf="isDeleting"></div>
            <i [class]="confirmIcon" *ngIf="!isDeleting"></i>
            <span>{{ isDeleting ? (loadingText || 'Procesando...') : (confirmText || 'Sí, confirmar') }}</span>
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
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 1rem;
    }

    .modal-container {
      background: white;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      max-width: 500px;
      width: 100%;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }

    .modal-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c);
      animation: shimmer 2s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    /* Icon Container */
    .icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 2rem;
      position: relative;
      height: 120px;
    }

    .warning-icon-wrapper {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
      animation: iconPulse 2s ease-in-out infinite;
    }

    @keyframes iconPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .warning-icon-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
      animation: rotate 10s linear infinite;
    }

    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .warning-icon {
      font-size: 3.5rem;
      color: #f59e0b;
      position: relative;
      z-index: 1;
      animation: bounce 1s ease-in-out infinite;
      filter: drop-shadow(0 4px 8px rgba(245, 158, 11, 0.3));
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* Particles */
    .particles {
      position: absolute;
      width: 150px;
      height: 150px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .particle {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      opacity: 0;
      animation: particleFloat 3s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.2s);
    }

    @keyframes particleFloat {
      0% {
        opacity: 0;
        transform: translate(0, 0) scale(0);
      }
      20% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        transform: translate(
          calc(cos(var(--i) * 45deg) * 60px),
          calc(sin(var(--i) * 45deg) * 60px)
        ) scale(1.5);
      }
    }

    /* Content */
    .modal-content {
      text-align: center;
      margin-bottom: 2rem;
    }

    .modal-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 1rem;
      line-height: 1.2;
    }

    .modal-message {
      font-size: 1rem;
      color: #6b7280;
      margin: 0 0 1.5rem;
      line-height: 1.6;
    }

    .info-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #bfdbfe;
      border-radius: 16px;
      margin-bottom: 1rem;
      text-align: left;
    }

    .info-box i {
      font-size: 1.5rem;
      color: #3b82f6;
      flex-shrink: 0;
    }

    .info-label {
      display: block;
      font-size: 0.8125rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      font-weight: 600;
    }

    .info-value {
      display: block;
      font-size: 1.125rem;
      color: #1f2937;
      font-weight: 700;
      word-break: break-word;
    }

    .warning-message {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #fbbf24;
      border-radius: 12px;
      text-align: left;
    }

    .warning-message i {
      font-size: 1.25rem;
      color: #d97706;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .warning-message p {
      margin: 0;
      font-size: 0.9375rem;
      color: #78350f;
      line-height: 1.5;
      font-weight: 500;
    }

    /* Actions */
    .modal-actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn:hover::before {
      width: 300px;
      height: 300px;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn i, .btn span {
      position: relative;
      z-index: 1;
    }

    .btn-cancel {
      background: #f3f4f6;
      color: #374151;
      border: 2px solid #d1d5db;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-cancel:hover:not(:disabled) {
      background: #e5e7eb;
      border-color: #9ca3af;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .btn-delete {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: 2px solid transparent;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .btn-delete:hover:not(:disabled) {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5);
    }

    .btn-delete:active:not(:disabled) {
      transform: translateY(0);
    }

    /* Spinner */
    .spinner {
      width: 18px;
      height: 18px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 640px) {
      .modal-container {
        padding: 2rem;
      }

      .modal-title {
        font-size: 1.5rem;
      }

      .modal-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
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
    trigger('bounceIn', [
      transition(':enter', [
        animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', keyframes([
          style({ opacity: 0, transform: 'scale(0.3)', offset: 0 }),
          style({ opacity: 1, transform: 'scale(1.05)', offset: 0.7 }),
          style({ transform: 'scale(0.95)', offset: 0.85 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ]),
      transition(':leave', [
        animate('300ms ease-in', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.05)', offset: 0.3 }),
          style({ opacity: 0, transform: 'scale(0.8)', offset: 1 })
        ]))
      ])
    ]),
    trigger('pulse', [
      transition(':enter', [
        animate('1s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms 200ms cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms 300ms cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms 400ms cubic-bezier(0.16, 1, 0.3, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class DeleteConfirmationModalComponent {
  @Input() visible: boolean = false;
  @Input() title: string = '¿Estás seguro?';
  @Input() message: string = 'Esta acción no se puede deshacer.';
  @Input() itemName?: string;
  @Input() itemLabel: string = 'Elemento a eliminar:';
  @Input() showWarning: boolean = true;
  @Input() warningMessage: string = 'Esta acción es permanente y no se puede revertir. Todos los datos asociados se perderán.';
  @Input() isDeleting: boolean = false;
  @Input() confirmText: string = 'Sí, eliminar';
  @Input() confirmIcon: string = 'pi pi-trash';
  @Input() loadingText: string = 'Eliminando...';
  
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isDeleting) {
      this.cancel();
    }
  }

  confirm(): void {
    if (!this.isDeleting) {
      this.onConfirm.emit();
    }
  }

  cancel(): void {
    if (!this.isDeleting) {
      this.onCancel.emit();
    }
  }
}
