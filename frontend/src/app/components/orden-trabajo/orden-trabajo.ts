import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { OrdenTrabajo, Cliente, Vehiculo, Mecanico } from '../../models';

@Component({
  selector: 'app-orden-trabajo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orden-trabajo.html',
  styleUrls: ['./orden-trabajo.css']
})
export class OrdenTrabajoComponent implements OnInit {
  ordenes: OrdenTrabajo[] = [];
  ordenesFiltradas: OrdenTrabajo[] = [];
  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  mecanicos: Mecanico[] = [];
  
  filtroEstado: string = '';
  filtroMecanico: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getOrdenesTrabajo().subscribe(ordenes => {
      this.ordenes = ordenes;
      this.ordenesFiltradas = [...ordenes];
    });
    
    this.dataService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
    
    this.dataService.getVehiculos().subscribe(vehiculos => {
      this.vehiculos = vehiculos;
    });
    
    this.dataService.getMecanicos().subscribe(mecanicos => {
      this.mecanicos = mecanicos;
    });
  }

  aplicarFiltros() {
    this.ordenesFiltradas = this.ordenes.filter(orden => {
      let cumpleFiltros = true;
      
      if (this.filtroEstado && orden.estado !== this.filtroEstado) {
        cumpleFiltros = false;
      }
      
      if (this.filtroMecanico && orden.idMecanico !== parseInt(this.filtroMecanico)) {
        cumpleFiltros = false;
      }
      
      return cumpleFiltros;
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

  getMecanicoName(idMecanico: number): string {
    const mecanico = this.mecanicos.find(m => m.idMecanico === idMecanico);
    return mecanico ? mecanico.nombre : 'N/A';
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

  editarOrden(orden: OrdenTrabajo) {
    // Implementar lógica de edición
    console.log('Editar orden:', orden);
  }

  cambiarEstado(orden: OrdenTrabajo) {
    // Implementar lógica de cambio de estado
    console.log('Cambiar estado de orden:', orden);
  }
}
