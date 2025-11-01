import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TestConnectionComponent } from './components/auth/test-connection/test-connection.component';
import { DashboardComponent } from './components/dashboard/dashboard-main/dashboard';

// Clientes
import { ClientsGetallComponent } from './features/clients/clients-getall/clients-getall.component';
import { ClientsCreateComponent } from './features/clients/clients-create/clients-create.component';
import { ClientsUpdateComponent } from './features/clients/clients-update/clients-update.component';

// Vehículos
import { VehiclesGetallComponent } from './features/vehicles/vehicles-getall/vehicles-getall.component';
import { VehiclesCreateComponent } from './features/vehicles/vehicles-create/vehicles-create.component';
import { VehiclesUpdateComponent } from './features/vehicles/vehicles-update/vehicles-update.component';

// Servicios
import { ServicesGetallComponent } from './features/services/services-getall/services-getall.component';
import { ServicesCreateComponent } from './features/services/services-create/services-create.component';
import { ServicesUpdateComponent } from './features/services/services-update/services-update.component';

// Repuestos
import { PartsGetallComponent } from './features/parts/parts-getall/parts-getall.component';
import { PartsCreateComponent } from './features/parts/parts-create/parts-create.component';
import { PartsUpdateComponent } from './features/parts/parts-update/parts-update.component';

// Citas
import { AppointmentGetallComponent } from './features/appointments/appointment-getall/appointment-getall.component';
import { AppointmentCreateComponent } from './features/appointments/appointment-create/appointment-create.component';
import { AppointmentUpdateComponent } from './features/appointments/appointment-update/appointment-update.component';

// Seguros
import { InsuranceGetallComponent } from './features/insurance/insurance-getall/insurance-getall.component';
import { InsuranceCreateComponent } from './features/insurance/insurance-create/insurance-create.component';
import { InsuranceUpdateComponent } from './features/insurance/insurance-update/insurance-update.component';

// Mecánicos
import { MechanicGetallComponent } from './features/mechanics/mechanic-getall/mechanic-getall.component';
import { MechanicCreateComponent } from './features/mechanics/mechanic-create/mechanic-create.component';
import { MechanicUpdateComponent } from './features/mechanics/mechanic-update/mechanic-update.component';

// Pagos
import { PaymentGetallComponent } from './features/payments/payment-getall/payment-getall.component';
import { PaymentCreateComponent } from './features/payments/payment-create/payment-create.component';
import { PaymentUpdateComponent } from './features/payments/payment-update/payment-update.component';

// Órdenes de Trabajo
import { WorkOrderGetallComponent } from './features/work-orders/work-order-getall/work-order-getall.component';
import { WorkOrderCreateComponent } from './features/work-orders/work-order-create/work-order-create.component';
import { WorkOrderUpdateComponent } from './features/work-orders/work-order-update/work-order-update.component';
import { AuthRecoveryTabsComponent } from './components/auth/auth-recovery-tabs/auth-recovery-tabs.component';

// Usuarios
import { UsersGetallComponent } from './features/users/users-getall/users-getall.component';

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
  
  // Rutas de Usuarios (solo ADMIN)
  { path: 'users', component: UsersGetallComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] } },
  
  { path: '**', redirectTo: '/dashboard' }
];