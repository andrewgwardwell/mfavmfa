import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgramsComponent } from './pages/programs/programs.component';
import { HomeComponent } from './pages/home/home.component';
import { ProgramComponent } from './pages/program/program.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserComponent } from './pages/user/user.component';
import { LoginComponent } from './pages/login/login.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { SubscriptionGuard } from './shared/guards/subscription.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { NotAuthGuard } from './shared/guards/not-auth.guard';
import { DiscoverComponent } from './pages/discover/discover.component';
import { TermsComponent } from './pages/terms/terms.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Mfa Vs. Mfa' }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard],
    data: { title: 'Login' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard],
    data: { title: 'Register' }
  },
  {
    path: 'programs',
    component: ProgramsComponent,
    canActivate: [AuthGuard, SubscriptionGuard],
    data: { title: 'Programs' }
  },
  {
    path: 'discover',
    component: DiscoverComponent,
    canActivate: [AuthGuard, SubscriptionGuard],
    data: { title: 'Discover' }
  },
  {
    path: 'program/:name',
    component: ProgramComponent,
    canActivate: [AuthGuard, SubscriptionGuard],
    data: { title: 'Program' }
  },
  {
    path: 'account',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { title: 'User' }
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Payment' }
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: { title: 'Terms of Use' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
