import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Repuesto } from '../../models';

@Component({
  selector: 'app-repuestos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repuestos.html',
  styleUrls: ['./repuestos.css']
})
export class RepuestosComponent implements OnInit {
  repuestos: Repuesto[] = [];
  
  mostrarModal = false;
  repuestoEditando: Repuesto | null = null;
  
  repuestoForm: Repuesto = {
    idRepuesto: 0,
    nombre: '',
    descripcion: '',
    precioUnitario: 0,
    stock: 0
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataService.getRepuestos().subscribe(repuestos => {
      this.repuestos = repuestos;
    });
  }

  mostrarFormulario() {
    this.mostrarModal = true;
    this.repuestoEditando = null;
    this.resetForm();
  }

  editarRepuesto(repuesto: Repuesto) {
    this.repuestoEditando = repuesto;
    this.repuestoForm = { ...repuesto };
    this.mostrarModal = true;
  }

  cerrarModal(event: Event) {
    this.mostrarModal = false;
    this.repuestoEditando = null;
    this.resetForm();
  }

  resetForm() {
    this.repuestoForm = {
      idRepuesto: 0,
      nombre: '',
      descripcion: '',
      precioUnitario: 0,
      stock: 0
    };
  }

  guardarRepuesto() {
    if (this.repuestoEditando) {
      // Actualizar repuesto existente
      const index = this.repuestos.findIndex(r => r.idRepuesto === this.repuestoEditando!.idRepuesto);
      if (index !== -1) {
        this.repuestos[index] = { ...this.repuestoForm };
      }
    } else {
      // Agregar nuevo repuesto
      const nuevoRepuesto: Repuesto = {
        ...this.repuestoForm,
        idRepuesto: this.repuestos.length + 1
      };
      this.repuestos.push(nuevoRepuesto);
    }
    
    this.cerrarModal(new Event('close'));
  }

  verDetalles(repuesto: Repuesto) {
    // Implementar vista de detalles del repuesto
    console.log('Ver detalles del repuesto:', repuesto);
  }
}
