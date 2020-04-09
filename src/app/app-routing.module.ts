import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramsComponent } from './pages/programs/programs.component';
import { HomeComponent } from './pages/home/home.component';
import { ProgramComponent } from './pages/program/program.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserComponent } from './pages/user/user.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  {    
    path: '',
    component: HomeComponent,
    data: { title: 'Mfa Vs. Mfa' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register' }
  },
  {
    path: 'programs',
    component: ProgramsComponent,
    data: { title: 'Programs' }
  },
  {
    path: 'program/:name',
    component: ProgramComponent,
    data: { title: 'Program' }
  },
  {
    path: 'account',
    component: UserComponent,
    data: { title: 'User' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
