import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationComponent } from './application/application.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'applications/:id', component: ApplicationComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
