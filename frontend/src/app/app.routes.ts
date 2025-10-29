import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TestConnectionComponent } from './components/auth/test-connection/test-connection.component';
import { DashboardComponent } from './components/dashboard/dashboard';

// Clientes
import { ClientsGetallComponent } from './components/clients/clients-getall/clients-getall.component';
import { ClientsCreateComponent } from './components/clients/clients-create/clients-create.component';
import { ClientsUpdateComponent } from './components/clients/clients-update/clients-update.component';

// Vehículos
import { VehiclesGetallComponent } from './components/vehicles/vehicles-getall/vehicles-getall.component';
import { VehiclesCreateComponent } from './components/vehicles/vehicles-create/vehicles-create.component';
import { VehiclesUpdateComponent } from './components/vehicles/vehicles-update/vehicles-update.component';

// Servicios
import { ServicesGetallComponent } from './components/services/services-getall/services-getall.component';
import { ServicesCreateComponent } from './components/services/services-create/services-create.component';
import { ServicesUpdateComponent } from './components/services/services-update/services-update.component';

// Repuestos
import { PartsGetallComponent } from './components/parts/parts-getall/parts-getall.component';
import { PartsCreateComponent } from './components/parts/parts-create/parts-create.component';
import { PartsUpdateComponent } from './components/parts/parts-update/parts-update.component';

// Citas
import { AppointmentGetallComponent } from './components/appointments/appointment-getall/appointment-getall.component';
import { AppointmentCreateComponent } from './components/appointments/appointment-create/appointment-create.component';
import { AppointmentUpdateComponent } from './components/appointments/appointment-update/appointment-update.component';

// Seguros
import { InsuranceGetallComponent } from './components/insurance/insurance-getall/insurance-getall.component';
import { InsuranceCreateComponent } from './components/insurance/insurance-create/insurance-create.component';
import { InsuranceUpdateComponent } from './components/insurance/insurance-update/insurance-update.component';

// Mecánicos
import { MechanicGetallComponent } from './components/mechanics/mechanic-getall/mechanic-getall.component';
import { MechanicCreateComponent } from './components/mechanics/mechanic-create/mechanic-create.component';
import { MechanicUpdateComponent } from './components/mechanics/mechanic-update/mechanic-update.component';

// Pagos
import { PaymentGetallComponent } from './components/payments/payment-getall/payment-getall.component';
import { PaymentCreateComponent } from './components/payments/payment-create/payment-create.component';
import { PaymentUpdateComponent } from './components/payments/payment-update/payment-update.component';

// Órdenes de Trabajo
import { WorkOrderGetallComponent } from './components/work-orders/work-order-getall/work-order-getall.component';
import { WorkOrderCreateComponent } from './components/work-orders/work-order-create/work-order-create.component';
import { WorkOrderUpdateComponent } from './components/work-orders/work-order-update/work-order-update.component';
import { AuthRecoveryTabsComponent } from './components/auth/auth-recovery-tabs/auth-recovery-tabs.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'test-connection', component: TestConnectionComponent },
  { path: 'forgot-password', component: AuthRecoveryTabsComponent },
  { path: 'reset-password', component: AuthRecoveryTabsComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  
  // Rutas de Clientes
  { path: 'clients', component: ClientsGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'clients/create', component: ClientsCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'clients/update/:id', component: ClientsUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  
  // Rutas de Vehículos
  { path: 'vehicles', component: VehiclesGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'vehicles/create', component: VehiclesCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'vehicles/update/:id', component: VehiclesUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  
  // Rutas de Servicios
  { path: 'services', component: ServicesGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'services/create', component: ServicesCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'services/update/:id', component: ServicesUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  
  // Rutas de Repuestos
  { path: 'parts', component: PartsGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'parts/create', component: PartsCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER'] } },
  { path: 'parts/update/:id', component: PartsUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER'] } },
  
  // Rutas de Citas
  { path: 'appointments', component: AppointmentGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'appointments/create', component: AppointmentCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'appointments/update/:id', component: AppointmentUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  
  // Rutas de Seguros
  { path: 'insurance', component: InsuranceGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'insurance/create', component: InsuranceCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'insurance/update/:id', component: InsuranceUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  
  // Rutas de Mecánicos
  { path: 'mechanics', component: MechanicGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'mechanics/create', component: MechanicCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER'] } },
  { path: 'mechanics/update/:id', component: MechanicUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER'] } },
  
  // Rutas de Pagos
  // Listar pagos: solo STAFF (ADMIN, MANAGER, RECEPTIONIST) como en backend isStaff
  { path: 'payments', component: PaymentGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'payments/create', component: PaymentCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'payments/update/:id', component: PaymentUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER'] } },
  
  // Rutas de Órdenes de Trabajo
  { path: 'work-orders', component: WorkOrderGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','RECEPTIONIST'] } },
  { path: 'work-orders/create', component: WorkOrderCreateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','MECHANIC'] } },
  { path: 'work-orders/update/:id', component: WorkOrderUpdateComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN','MANAGER','MECHANIC'] } },
  
  { path: '**', redirectTo: '/dashboard' }
];