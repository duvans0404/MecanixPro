// Interfaces para el sistema MecanixPro

export interface Cliente {
  idCliente: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

export interface Aseguradora {
  idAseguradora: number;
  nombre: string;
  telefono: string;
  direccion: string;
  numeroPoliza: string;
  fechaVencimiento: Date;
}

export interface Vehiculo {
  idVehiculo: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  idCliente: number;
  idAseguradora?: number; // Opcional
}

export interface Cita {
  idCita: number;
  fecha: Date;
  hora: string;
  motivo: string;
  idCliente: number;
  idVehiculo: number;
}

export interface Mecanico {
  idMecanico: number;
  nombre: string;
  especialidad: string;
  telefono: string;
}

export interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string;
  costoManoObra: number;
}

export interface Repuesto {
  idRepuesto: number;
  nombre: string;
  descripcion: string;
  precioUnitario: number;
  stock: number;
}

export interface OrdenTrabajo {
  idOT: number;
  fechaCreacion: Date;
  estado: 'diagnostico' | 'reparacion' | 'listo';
  idVehiculo: number;
  idMecanico?: number;
  observaciones: string;
}

export interface OrdenServicio {
  idOT: number;
  idServicio: number;
  cantidadHoras: number;
  subtotal: number;
}

export interface OrdenRepuesto {
  idOT: number;
  idRepuesto: number;
  cantidad: number;
  subtotal: number;
}

export interface Pago {
  idPago: number;
  idOT: number;
  fechaPago: Date;
  montoTotal: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
}

// Interfaces extendidas para mostrar información relacionada
export interface OrdenTrabajoCompleta extends OrdenTrabajo {
  vehiculo?: Vehiculo;
  cliente?: Cliente;
  mecanico?: Mecanico;
  servicios?: OrdenServicio[];
  repuestos?: OrdenRepuesto[];
  totalServicios?: number;
  totalRepuestos?: number;
  totalGeneral?: number;
}

export interface ClienteCompleto extends Cliente {
  vehiculos?: Vehiculo[];
  citas?: Cita[];
  ordenesTrabajo?: OrdenTrabajo[];
}

export interface VehiculoCompleto extends Vehiculo {
  cliente?: Cliente;
  aseguradora?: Aseguradora;
  ordenesTrabajo?: OrdenTrabajo[];
}
