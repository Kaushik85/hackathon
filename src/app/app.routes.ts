import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/components/login/login.component'; 
import { RegisterComponent } from './features/register/components/register/register.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { TicketComponent } from './features/ticket/components/ticket/ticket.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tickets',
    component: TicketComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch : 'prefix'
  },
];
