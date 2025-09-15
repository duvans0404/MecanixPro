import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, TagModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  stats: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.dataService.getTotalClientes().subscribe(total => this.stats.totalClientes = total);
    this.dataService.getTotalVehiculos().subscribe(total => this.stats.totalVehiculos = total);
    this.dataService.getOrdenesPendientes().subscribe(total => this.stats.ordenesPendientes = total);
    this.dataService.getOrdenesCompletadas().subscribe(total => this.stats.ordenesCompletadas = total);
    this.dataService.getTotalServicios().subscribe(total => this.stats.totalServicios = total);
    this.dataService.getTotalRepuestos().subscribe(total => this.stats.totalRepuestos = total);
    
    // Nuevas estadísticas
    this.dataService.getTotalAppointments().subscribe(total => this.stats.totalAppointments = total);
    this.dataService.getTotalInsurance().subscribe(total => this.stats.totalInsurance = total);
    this.dataService.getTotalMechanics().subscribe(total => this.stats.totalMechanics = total);
    this.dataService.getTotalPayments().subscribe(total => this.stats.totalPayments = total);
    this.dataService.getTotalWorkOrders().subscribe(total => this.stats.totalWorkOrders = total);
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
}