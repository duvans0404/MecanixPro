import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { OrdenTrabajoComponent } from './components/orden-trabajo/orden-trabajo';
import { ClientesComponent } from './components/clientes/clientes';
import { VehiculosComponent } from './components/vehiculos/vehiculos';
import { ServiciosComponent } from './components/servicios/servicios';
import { RepuestosComponent } from './components/repuestos/repuestos';
import { PagosComponent } from './components/pagos/pagos';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ordenes-trabajo', component: OrdenTrabajoComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'vehiculos', component: VehiculosComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'repuestos', component: RepuestosComponent },
  { path: 'pagos', component: PagosComponent },
  { path: '**', redirectTo: '/dashboard' }
];
