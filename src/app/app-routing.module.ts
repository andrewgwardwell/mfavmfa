import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramsComponent } from './pages/programs/programs.component';
import { RegisterComponent } from './pages/register/register.component';
import { CompareComponent } from './pages/compare/compare.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
  { path: '',
    redirectTo: '/programs',
    pathMatch: 'full'
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
    path: 'programs/compare',
    component: CompareComponent,
    data: { title: 'Compare' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
