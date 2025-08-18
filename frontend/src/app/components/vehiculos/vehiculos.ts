import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Vehiculo, Cliente, OrdenTrabajo } from '../../models';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculos.html',
  styleUrls: ['./vehiculos.css']
})
export class VehiculosComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  clientes: Cliente[] = [];
  ordenesTrabajo: OrdenTrabajo[] = [];
  
  mostrarModal = false;
  vehiculoEditando: Vehiculo | null = null;
  
  vehiculoForm: Vehiculo = {
    idVehiculo: 0,
    placa: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    color: '',
    idCliente: 0
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getVehiculos().subscribe(vehiculos => {
      this.vehiculos = vehiculos;
    });
    
    this.dataService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
    
    this.dataService.getOrdenesTrabajo().subscribe(ordenes => {
      this.ordenesTrabajo = ordenes;
    });
  }

  mostrarFormulario() {
    this.mostrarModal = true;
    this.vehiculoEditando = null;
    this.resetForm();
  }

  editarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoEditando = vehiculo;
    this.vehiculoForm = { ...vehiculo };
    this.mostrarModal = true;
  }

  cerrarModal(event: Event) {
    this.mostrarModal = false;
    this.vehiculoEditando = null;
    this.resetForm();
  }

  resetForm() {
    this.vehiculoForm = {
      idVehiculo: 0,
      placa: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      color: '',
      idCliente: 0
    };
  }

  guardarVehiculo() {
    if (this.vehiculoEditando) {
      // Actualizar vehículo existente
      const index = this.vehiculos.findIndex(v => v.idVehiculo === this.vehiculoEditando!.idVehiculo);
      if (index !== -1) {
        this.vehiculos[index] = { ...this.vehiculoForm };
      }
    } else {
      // Agregar nuevo vehículo
      this.dataService.addVehiculo(this.vehiculoForm).subscribe(nuevoVehiculo => {
        this.vehiculos.push(nuevoVehiculo);
      });
    }
    
    this.cerrarModal(new Event('close'));
  }

  verDetalles(vehiculo: Vehiculo) {
    // Implementar vista de detalles del vehículo
    console.log('Ver detalles del vehículo:', vehiculo);
  }

  getClienteName(idCliente: number): string {
    const cliente = this.clientes.find(c => c.idCliente === idCliente);
    return cliente ? cliente.nombre : 'N/A';
  }

  getOrdenesCount(idVehiculo: number): number {
    return this.ordenesTrabajo.filter(ot => ot.idVehiculo === idVehiculo).length;
  }
}
