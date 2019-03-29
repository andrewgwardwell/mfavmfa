import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramsComponent } from './pages/programs/programs.component';


const routes: Routes = [
  { path: '',
    redirectTo: '/programs',
    pathMatch: 'full'
  },
  {
    path: 'programs',
    component: ProgramsComponent,
    data: { title: 'Programs' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
