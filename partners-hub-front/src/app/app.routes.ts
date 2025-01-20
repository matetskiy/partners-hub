import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CounterpartyListComponent } from './components/counterparty-list/counterparty-list.component';
import { AddCounterpartyComponent } from './components/add-counterparty/add-counterparty.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'translation', component: RegisterComponent },
  { path: 'counterparties', component: CounterpartyListComponent, canActivate: [AuthGuard] },
  { path: 'add-counterparty', component: AddCounterpartyComponent, canActivate: [AuthGuard, AdminGuard] }
];

