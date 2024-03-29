import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import {DataViewModule} from 'primeng/dataview';
import {MultiSelectModule} from 'primeng/multiselect';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {BlockUIModule} from 'primeng/blockui';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DragDropModule} from 'primeng/dragdrop';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {PanelModule} from 'primeng/panel';
import {StripeCheckoutModule} from 'ng-stripe-checkout';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';


//components
import { AppComponent } from './app.component';
import { ProgramsComponent } from './pages/programs/programs.component';
import { AddProgramComponent } from './shared/add-program/add-program.component';
//services
import { ProgramsService } from './services/programs.service';
import { EntityService } from './services/entity.service';
import { UserService } from './services/user.service';
import { DrupalStripeService } from './services/stripe.service';
import { AuthService } from './services/auth/auth.service';
import { CampaignService } from './services/campaign.service';
import {MessageService} from 'primeng/api';
//config
import { environment } from '../environments/environment';
// Interceptors
import { TokenInterceptor } from './services/auth/token.interceptor';
import { ExpiresInterceptor } from './services/auth/expires.interceptor';
// Site Structure
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { JoinPipe } from './pipes/join.pipe';
import { UserComponent } from './pages/user/user.component';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { MapComponent } from './shared/map/map.component';
import { CompChartsComponent } from './shared/comp-charts/comp-charts.component';
import { ProgramComponent } from './pages/program/program.component';
import { HomeComponent } from './pages/home/home.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { MatButtonModule, MatGridListModule, MatSelectModule } from '@angular/material';
import { StripeTokenComponent } from './shared/stripe-token/stripe-token.component';
import { NgxStripeModule } from 'ngx-stripe';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { TermsComponent } from './pages/terms/terms.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    ProgramsComponent,
    AddProgramComponent,
    RegisterComponent,
    LoginComponent,
    JoinPipe,
    UserComponent,
    NavigationComponent,
    MapComponent,
    CompChartsComponent,
    ProgramComponent,
    HomeComponent,
    PaymentComponent,
    DiscoverComponent,
    StripeTokenComponent,
    TermsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MultiSelectModule,
    DataViewModule,
    AutoCompleteModule,
    ProgressSpinnerModule,
    FormsModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatProgressBarModule,
    SidebarModule,
    ButtonModule,
    BlockUIModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    TableModule,
    MatTabsModule,
    MatListModule,
    PanelModule,
    StripeCheckoutModule,
    MatSidenavModule,
    LeafletModule,
    ChartModule,
    ChartsModule,
    NgbModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    NgxStripeModule.forRoot('pk_live_Yralrw5vIaiSy9CznPb0mbYw'),
    MatButtonToggleModule,
    MatGridListModule
  ],
  providers: [
    ProgramsService,
    EntityService,
    UserService,
    MessageService,
    AuthService,
    DrupalStripeService,
    CampaignService,
    { provide: 'environment', useValue: environment },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExpiresInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
