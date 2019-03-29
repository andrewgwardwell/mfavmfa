import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import {DataViewModule} from 'primeng/dataview';
import {MultiSelectModule} from 'primeng/multiselect';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from 'primeng/dragdrop';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';

//components
import { AppComponent } from './app.component';
import { ProgramsComponent } from './pages/programs/programs.component';
//services
import { ProgramsService } from './services/programs.service';


@NgModule({
  declarations: [
    AppComponent,
    ProgramsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MultiSelectModule,
    DataViewModule,
    AutoCompleteModule,
    FormsModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [
    ProgramsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
