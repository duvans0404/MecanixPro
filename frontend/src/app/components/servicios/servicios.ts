import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Servicio } from '../../models';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  
  mostrarModal = false;
  servicioEditando: Servicio | null = null;
  
  servicioForm: Servicio = {
    idServicio: 0,
    nombre: '',
    descripcion: '',
    costoManoObra: 0
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getServicios().subscribe(servicios => {
      this.servicios = servicios;
    });
  }

  mostrarFormulario() {
    this.mostrarModal = true;
    this.servicioEditando = null;
    this.resetForm();
  }

  editarServicio(servicio: Servicio) {
    this.servicioEditando = servicio;
    this.servicioForm = { ...servicio };
    this.mostrarModal = true;
  }

  cerrarModal(event: Event) {
    this.mostrarModal = false;
    this.servicioEditando = null;
    this.resetForm();
  }

  resetForm() {
    this.servicioForm = {
      idServicio: 0,
      nombre: '',
      descripcion: '',
      costoManoObra: 0
    };
  }

  guardarServicio() {
    if (this.servicioEditando) {
      // Actualizar servicio existente
      const index = this.servicios.findIndex(s => s.idServicio === this.servicioEditando!.idServicio);
      if (index !== -1) {
        this.servicios[index] = { ...this.servicioForm };
      }
    } else {
      // Agregar nuevo servicio
      const nuevoServicio: Servicio = {
        ...this.servicioForm,
        idServicio: this.servicios.length + 1
      };
      this.servicios.push(nuevoServicio);
    }
    
    this.cerrarModal(new Event('close'));
  }

  verDetalles(servicio: Servicio) {
    // Implementar vista de detalles del servicio
    console.log('Ver detalles del servicio:', servicio);
  }
}
