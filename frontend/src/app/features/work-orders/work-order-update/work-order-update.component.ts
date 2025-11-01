import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { WorkOrder } from '../../../shared/models/work-order.model';

@Component({
  selector: 'app-work-order-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-order-update.component.html',
})
export class WorkOrderUpdateComponent implements OnInit {
  workOrder: WorkOrder = {
    id: 0,
    clientId: 0,
    vehicleId: 0,
    mechanicId: 0,
    serviceId: 0,
    description: '',
    status: 'pending',
    priority: 'medium',
    estimatedHours: 0,
    actualHours: 0,
    laborCost: 0,
    partsCost: 0,
    totalCost: 0,
    startDate: new Date(),
    endDate: new Date(),
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  loading = false;
  error: string | null = null;
  workOrderId: number = 0;

  constructor(
    private workOrderService: WorkOrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.workOrderId = +params['id'];
      if (this.workOrderId) {
        this.loadWorkOrder();
      }
    });
  }

  loadWorkOrder() {
    this.loading = true;
    this.error = null;
    
    this.workOrderService.getWorkOrderById(this.workOrderId).subscribe({
      next: (workOrder: WorkOrder | undefined) => {
        if (workOrder) {
          this.workOrder = workOrder;
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar la orden de trabajo';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    
    this.workOrderService.updateWorkOrder(this.workOrderId, this.workOrder).subscribe({
      next: (response: any) => {
        console.log('Orden de trabajo actualizada exitosamente:', response);
        this.router.navigate(['/work-orders']);
      },
      error: (error: any) => {
        this.error = 'Error al actualizar la orden de trabajo';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/work-orders']);
  }
}
