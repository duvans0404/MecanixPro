import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Cliente, Vehiculo } from '../../models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  
  mostrarModal = false;
  clienteEditando: Cliente | null = null;
  
  clienteForm: Cliente = {
    idCliente: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
    
    this.dataService.getVehiculos().subscribe(vehiculos => {
      this.vehiculos = vehiculos;
    });
  }

  mostrarFormulario() {
    this.mostrarModal = true;
    this.clienteEditando = null;
    this.resetForm();
  }

  editarCliente(cliente: Cliente) {
    this.clienteEditando = cliente;
    this.clienteForm = { ...cliente };
    this.mostrarModal = true;
  }

  cerrarModal(event: Event) {
    this.mostrarModal = false;
    this.clienteEditando = null;
    this.resetForm();
  }

  resetForm() {
    this.clienteForm = {
      idCliente: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    };
  }

  guardarCliente() {
    if (this.clienteEditando) {
      // Actualizar cliente existente
      const index = this.clientes.findIndex(c => c.idCliente === this.clienteEditando!.idCliente);
      if (index !== -1) {
        this.clientes[index] = { ...this.clienteForm };
      }
    } else {
      // Agregar nuevo cliente
      this.dataService.addCliente(this.clienteForm).subscribe(nuevoCliente => {
        this.clientes.push(nuevoCliente);
      });
    }
    
    this.cerrarModal(new Event('close'));
  }

  verDetalles(cliente: Cliente) {
    // Implementar vista de detalles del cliente
    console.log('Ver detalles del cliente:', cliente);
  }

  getVehiculosCount(idCliente: number): number {
    return this.vehiculos.filter(v => v.idCliente === idCliente).length;
  }
}
