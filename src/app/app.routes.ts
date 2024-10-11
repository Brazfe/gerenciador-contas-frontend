import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PerfisComponent } from './perfis/perfis.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, 
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'usuarios', component: UsuariosComponent }, 
  { path: 'perfis', component: PerfisComponent }, 


];

export const appRouting = [
  provideRouter(routes) 
];
