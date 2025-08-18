import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { OrdenTrabajo, Cliente, Vehiculo } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  ordenesRecientes: OrdenTrabajo[] = [];
  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Cargar estadísticas
    this.stats = this.dataService.getDashboardStats();
    
    // Cargar órdenes recientes
    this.dataService.getOrdenesTrabajo().subscribe(ordenes => {
      this.ordenesRecientes = ordenes.slice(0, 5); // Solo las 5 más recientes
    });
    
    // Cargar clientes y vehículos para mostrar información
    this.dataService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
    
    this.dataService.getVehiculos().subscribe(vehiculos => {
      this.vehiculos = vehiculos;
    });
  }

  getClienteName(idVehiculo: number): string {
    const vehiculo = this.vehiculos.find(v => v.idVehiculo === idVehiculo);
    if (vehiculo) {
      const cliente = this.clientes.find(c => c.idCliente === vehiculo.idCliente);
      return cliente ? cliente.nombre : 'N/A';
    }
    return 'N/A';
  }

  getVehiculoInfo(idVehiculo: number): string {
    const vehiculo = this.vehiculos.find(v => v.idVehiculo === idVehiculo);
    if (vehiculo) {
      return `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})`;
    }
    return 'N/A';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'diagnostico':
        return 'badge-warning';
      case 'reparacion':
        return 'badge-info';
      case 'listo':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  }

  getEstadoText(estado: string): string {
    switch (estado) {
      case 'diagnostico':
        return 'Diagnóstico';
      case 'reparacion':
        return 'Reparación';
      case 'listo':
        return 'Listo';
      default:
        return estado;
    }
  }
}
