import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  Cliente, 
  Vehiculo, 
  OrdenTrabajo, 
  Servicio, 
  Repuesto, 
  Mecanico,
  OrdenTrabajoCompleta 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  // Datos de ejemplo para el frontend
  private clientes: Cliente[] = [
    {
      idCliente: 1,
      nombre: 'Juan Pérez',
      direccion: 'Calle 123 #45-67, Bogotá',
      telefono: '300-123-4567',
      correo: 'juan.perez@email.com'
    },
    {
      idCliente: 2,
      nombre: 'María González',
      direccion: 'Carrera 78 #90-12, Medellín',
      telefono: '310-987-6543',
      correo: 'maria.gonzalez@email.com'
    },
    {
      idCliente: 3,
      nombre: 'Carlos Rodríguez',
      direccion: 'Avenida 56 #34-89, Cali',
      telefono: '315-555-1234',
      correo: 'carlos.rodriguez@email.com'
    }
  ];

  private vehiculos: Vehiculo[] = [
    {
      idVehiculo: 1,
      placa: 'ABC123',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      color: 'Blanco',
      idCliente: 1
    },
    {
      idVehiculo: 2,
      placa: 'XYZ789',
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2019,
      color: 'Negro',
      idCliente: 2
    },
    {
      idVehiculo: 3,
      placa: 'DEF456',
      marca: 'Ford',
      modelo: 'Focus',
      anio: 2021,
      color: 'Azul',
      idCliente: 3
    }
  ];

  private servicios: Servicio[] = [
    {
      idServicio: 1,
      nombre: 'Cambio de Aceite',
      descripcion: 'Cambio de aceite y filtro del motor',
      costoManoObra: 50000
    },
    {
      idServicio: 2,
      nombre: 'Frenos',
      descripcion: 'Revisión y ajuste del sistema de frenos',
      costoManoObra: 80000
    },
    {
      idServicio: 3,
      nombre: 'Suspensión',
      descripcion: 'Revisión y reparación del sistema de suspensión',
      costoManoObra: 120000
    },
    {
      idServicio: 4,
      nombre: 'Motor',
      descripcion: 'Diagnóstico y reparación del motor',
      costoManoObra: 200000
    }
  ];

  private repuestos: Repuesto[] = [
    {
      idRepuesto: 1,
      nombre: 'Aceite de Motor',
      descripcion: 'Aceite sintético 5W-30',
      precioUnitario: 45000,
      stock: 50
    },
    {
      idRepuesto: 2,
      nombre: 'Filtro de Aceite',
      descripcion: 'Filtro de aceite compatible',
      precioUnitario: 15000,
      stock: 30
    },
    {
      idRepuesto: 3,
      nombre: 'Pastillas de Freno',
      descripcion: 'Pastillas de freno delanteras',
      precioUnitario: 35000,
      stock: 25
    },
    {
      idRepuesto: 4,
      nombre: 'Bujías',
      descripcion: 'Bujías de encendido',
      precioUnitario: 25000,
      stock: 40
    }
  ];

  private mecanicos: Mecanico[] = [
    {
      idMecanico: 1,
      nombre: 'Roberto Silva',
      especialidad: 'Motor y Transmisión',
      telefono: '300-111-2222'
    },
    {
      idMecanico: 2,
      nombre: 'Luis Mendoza',
      especialidad: 'Suspensión y Dirección',
      telefono: '300-333-4444'
    },
    {
      idMecanico: 3,
      nombre: 'Diego Ramírez',
      especialidad: 'Sistema Eléctrico',
      telefono: '300-555-6666'
    }
  ];

  private ordenesTrabajo: OrdenTrabajo[] = [
    {
      idOT: 1,
      fechaCreacion: new Date('2024-08-10'),
      estado: 'diagnostico',
      idVehiculo: 1,
      idMecanico: 1,
      observaciones: 'El vehículo presenta ruidos extranios en el motor'
    },
    {
      idOT: 2,
      fechaCreacion: new Date('2024-08-12'),
      estado: 'reparacion',
      idVehiculo: 2,
      idMecanico: 2,
      observaciones: 'Cambio de pastillas de freno y revisión del sistema'
    },
    {
      idOT: 3,
      fechaCreacion: new Date('2024-08-13'),
      estado: 'listo',
      idVehiculo: 3,
      idMecanico: 3,
      observaciones: 'Cambio de aceite y filtro completado'
    }
  ];

  constructor() { }

  // Métodos para obtener datos
  getClientes(): Observable<Cliente[]> {
    return of(this.clientes);
  }

  getVehiculos(): Observable<Vehiculo[]> {
    return of(this.vehiculos);
  }

  getServicios(): Observable<Servicio[]> {
    return of(this.servicios);
  }

  getRepuestos(): Observable<Repuesto[]> {
    return of(this.repuestos);
  }

  getMecanicos(): Observable<Mecanico[]> {
    return of(this.mecanicos);
  }

  getOrdenesTrabajo(): Observable<OrdenTrabajo[]> {
    return of(this.ordenesTrabajo);
  }

  // Métodos para agregar nuevos elementos
  addCliente(cliente: Cliente): Observable<Cliente> {
    cliente.idCliente = this.clientes.length + 1;
    this.clientes.push(cliente);
    return of(cliente);
  }

  addVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    vehiculo.idVehiculo = this.vehiculos.length + 1;
    this.vehiculos.push(vehiculo);
    return of(vehiculo);
  }

  addOrdenTrabajo(orden: OrdenTrabajo): Observable<OrdenTrabajo> {
    orden.idOT = this.ordenesTrabajo.length + 1;
    this.ordenesTrabajo.push(orden);
    return of(orden);
  }

  // Métodos para obtener estadísticas del dashboard
  getDashboardStats() {
    return {
      totalClientes: this.clientes.length,
      totalVehiculos: this.vehiculos.length,
      ordenesPendientes: this.ordenesTrabajo.filter(ot => ot.estado !== 'listo').length,
      ordenesCompletadas: this.ordenesTrabajo.filter(ot => ot.estado === 'listo').length,
      totalServicios: this.servicios.length,
      totalRepuestos: this.repuestos.length,
      totalMecanicos: this.mecanicos.length
    };
  }
}
