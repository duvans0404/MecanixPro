import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { ClientService } from '../../../core/services/client.service';
import { VehicleService } from '../../../core/services/vehicle.service';
import { ServiceService } from '../../../core/services/service.service';
import { PartService } from '../../../core/services/part.service';
import { MechanicService } from '../../../core/services/mechanic.service';
import { PaymentService } from '../../../core/services/payment.service';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TagModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  stats: any = {};

  constructor(
    private dataService: DataService,
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private serviceService: ServiceService,
    private partService: PartService,
    private mechanicService: MechanicService,
    private paymentService: PaymentService,
    private workOrderService: WorkOrderService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.setupCharts();
  }

  loadStats() {
    // Clientes reales
    this.clientService.getClients().subscribe(clients => this.stats.totalClientes = clients.length);
    // Vehículos reales
    this.vehicleService.getVehicles().subscribe(vehicles => this.stats.totalVehiculos = vehicles.length);
    // Servicios reales
    this.serviceService.getServices().subscribe(services => this.stats.totalServicios = services.length);
    // Repuestos reales
    this.partService.getParts().subscribe(parts => this.stats.totalRepuestos = parts.reduce((acc, p) => acc + (p.stock || 0), 0));
    // Mecánicos reales
    this.mechanicService.getMechanics().subscribe(mechanics => this.stats.totalMechanics = mechanics.length);
    // Pagos reales
    this.paymentService.getPayments().subscribe(payments => this.stats.totalPayments = payments.length);
    // Órdenes de trabajo reales
    this.workOrderService.getWorkOrders().subscribe(orders => {
      this.stats.totalWorkOrders = orders.length;
      this.stats.ordenesPendientes = orders.filter(o => o.status === 'pending' || o.status === 'in-progress').length;
      this.stats.ordenesCompletadas = orders.filter(o => o.status === 'completed').length;
    });
    // Citas reales
    this.dataService.getAppointments && this.dataService.getAppointments().subscribe(citas => {
      this.stats.totalAppointments = citas.length;
      const ahora = new Date();
      this.stats.proximosServicios = (citas || [])
        .filter(c => new Date(c.date) > ahora)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
        .map(c => ({ nombre: c.serviceName || c.title || 'Servicio', fecha: new Date(c.date) }));
    });
    // Alertas: repuestos con stock bajo y órdenes próximas a vencer
    this.partService.getParts().subscribe(repuestos => {
      const alertasStock = (repuestos || [])
        .filter(r => r.stock !== undefined && r.stock <= 10)
        .map(r => ({ mensaje: `Stock bajo: ${r.name}`, fecha: new Date() }));
      this.workOrderService.getWorkOrders().subscribe(ordenes => {
        const ahora = new Date();
        const alertasOrdenes = (ordenes || [])
          .filter(o => o.endDate && new Date(o.endDate) > ahora && (new Date(o.endDate).getTime() - ahora.getTime()) < 3*86400000)
          .map(o => ({ mensaje: `Orden próxima a vencer: #${o.id}`, fecha: new Date(o.endDate) }));
        this.stats.alertas = [...alertasStock, ...alertasOrdenes];
      });
    });

    // Próximos servicios: obtener de citas futuras (simulado)
    this.dataService.getAppointments && this.dataService.getAppointments().subscribe(citas => {
      const ahora = new Date();
      this.stats.proximosServicios = (citas || [])
        .filter(c => new Date(c.date) > ahora)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
        .map(c => ({ nombre: c.serviceName || c.title || 'Servicio', fecha: new Date(c.date) }));
    });

    // Alertas: repuestos con stock bajo y órdenes próximas a vencer
    this.dataService.getRepuestos().subscribe(repuestos => {
      const alertasStock = (repuestos || [])
        .filter(r => r.stock !== undefined && r.stock <= 10)
        .map(r => ({ mensaje: `Stock bajo: ${r.name}`, fecha: new Date() }));
      this.dataService.getOrdenesTrabajo().subscribe(ordenes => {
        const ahora = new Date();
        const alertasOrdenes = (ordenes || [])
          .filter(o => o.endDate && new Date(o.endDate) > ahora && (new Date(o.endDate).getTime() - ahora.getTime()) < 3*86400000)
          .map(o => ({ mensaje: `Orden próxima a vencer: #${o.id}`, fecha: new Date(o.endDate) }));
        this.stats.alertas = [...alertasStock, ...alertasOrdenes];
      });
    });
  }

  getCurrentTime(): string {
    return new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Gráficas para el dashboard
  chartData: any;
  chartOptions: any;
  pieData: any;
  pieOptions: any;

  setupCharts() {
    // Gráfica de barras: Órdenes por estado
    this.chartData = {
      labels: ['Pendientes', 'En Progreso', 'Completadas'],
      datasets: [
        {
          label: 'Órdenes',
          backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
          data: [
            this.stats.ordenesPendientes || 0,
            this.stats.ordenesPendientes || 0, // Suponiendo que "en progreso" es igual a pendientes
            this.stats.ordenesCompletadas || 0
          ]
        }
      ]
    };
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Órdenes de Trabajo' }
      }
    };
    // Gráfica de pastel: Distribución de servicios
    this.pieData = {
      labels: ['Servicios', 'Repuestos', 'Pagos'],
      datasets: [
        {
          data: [
            this.stats.totalServicios || 0,
            this.stats.totalRepuestos || 0,
            this.stats.totalPayments || 0
          ],
          backgroundColor: ['#6366f1', '#ef4444', '#3b82f6'],
          hoverBackgroundColor: ['#818cf8', '#f87171', '#60a5fa']
        }
      ]
    };
    this.pieOptions = {
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Distribución General' }
      }
    };
  }
}