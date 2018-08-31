import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationComponent } from './application/application.component';
import { EndToEndTestFormComponent } from './end-to-end-test-form/end-to-end-test-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ApplicationsComponent,
    ApplicationComponent,
    EndToEndTestFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
