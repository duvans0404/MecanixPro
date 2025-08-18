import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Pago, OrdenTrabajo, Cliente, Vehiculo } from '../../models';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.html',
  styleUrls: ['./pagos.css']
})
export class PagosComponent implements OnInit {
  pagos: Pago[] = [];
  ordenesTrabajo: OrdenTrabajo[] = [];
  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  
  mostrarModal = false;
  
  pagoForm: Pago = {
    idPago: 0,
    idOT: 0,
    fechaPago: new Date(),
    montoTotal: 0,
    metodoPago: 'efectivo'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getOrdenesTrabajo().subscribe(ordenes => {
      this.ordenesTrabajo = ordenes;
    });
    
    this.dataService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
    
    this.dataService.getVehiculos().subscribe(vehiculos => {
      this.vehiculos = vehiculos;
    });
    
    // Cargar pagos de ejemplo
    this.pagos = [
      {
        idPago: 1,
        idOT: 1,
        fechaPago: new Date('2024-08-10'),
        montoTotal: 150000,
        metodoPago: 'efectivo'
      },
      {
        idPago: 2,
        idOT: 2,
        fechaPago: new Date('2024-08-12'),
        montoTotal: 250000,
        metodoPago: 'tarjeta'
      },
      {
        idPago: 3,
        idOT: 3,
        fechaPago: new Date('2024-08-13'),
        montoTotal: 80000,
        metodoPago: 'transferencia'
      }
    ];
  }

  mostrarFormulario() {
    this.mostrarModal = true;
    this.resetForm();
  }

  cerrarModal(event: Event) {
    this.mostrarModal = false;
    this.resetForm();
  }

  resetForm() {
    this.pagoForm = {
      idPago: 0,
      idOT: 0,
      fechaPago: new Date(),
      montoTotal: 0,
      metodoPago: 'efectivo'
    };
  }

  guardarPago() {
    const nuevoPago: Pago = {
      ...this.pagoForm,
      idPago: this.pagos.length + 1,
      fechaPago: new Date()
    };
    
    this.pagos.push(nuevoPago);
    this.cerrarModal(new Event('close'));
  }

  verDetalles(pago: Pago) {
    // Implementar vista de detalles del pago
    console.log('Ver detalles del pago:', pago);
  }

  generarFactura(pago: Pago) {
    // Implementar generación de factura
    console.log('Generar factura para pago:', pago);
  }

  getClienteName(idOT: number): string {
    const orden = this.ordenesTrabajo.find(ot => ot.idOT === idOT);
    if (orden) {
      const vehiculo = this.vehiculos.find(v => v.idVehiculo === orden.idVehiculo);
      if (vehiculo) {
        const cliente = this.clientes.find(c => c.idCliente === vehiculo.idCliente);
        return cliente ? cliente.nombre : 'N/A';
      }
    }
    return 'N/A';
  }

  getVehiculoInfo(idOT: number): string {
    const orden = this.ordenesTrabajo.find(ot => ot.idOT === idOT);
    if (orden) {
      const vehiculo = this.vehiculos.find(v => v.idVehiculo === orden.idVehiculo);
      if (vehiculo) {
        return `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})`;
      }
    }
    return 'N/A';
  }

  getMetodoPagoText(metodo: string): string {
    switch (metodo) {
      case 'efectivo':
        return 'Efectivo';
      case 'tarjeta':
        return 'Tarjeta';
      case 'transferencia':
        return 'Transferencia';
      default:
        return metodo;
    }
  }
}
