import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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
import {FormsModule} from '@angular/forms';
import {DragDropModule} from 'primeng/dragdrop';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {PanelModule} from 'primeng/panel';

//components
import { AppComponent } from './app.component';
import { ProgramsComponent } from './pages/programs/programs.component';
import { AddProgramComponent } from './shared/add-program/add-program.component';
//services
import { ProgramsService } from './services/programs.service';
import { EntityService } from './services/entity.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth/auth.service';
import {MessageService} from 'primeng/api';
//config
import { environment } from '../environments/environment';
// Interceptors
import { TokenInterceptor } from './services/auth/token.interceptor';
import { ExpiresInterceptor } from './services/auth/expires.interceptor';
// Site Structure
import { CompareComponent } from './pages/compare/compare.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { JoinPipe } from './pipes/join.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ProgramsComponent,
    AddProgramComponent,
    CompareComponent,
    RegisterComponent,
    LoginComponent,
    JoinPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MultiSelectModule,
    DataViewModule,
    AutoCompleteModule,
    ProgressSpinnerModule,
    FormsModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatCardModule,
    SidebarModule,
    ButtonModule,
    BlockUIModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    TableModule,
    MatTabsModule,
    PanelModule
  ],
  providers: [
    ProgramsService,
    EntityService,
    UserService,
    MessageService,
    AuthService,
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
