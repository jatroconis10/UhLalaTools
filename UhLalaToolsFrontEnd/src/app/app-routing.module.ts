import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationComponent } from './application/application.component';
import { EndToEndTestFormComponent } from './end-to-end-test-form/end-to-end-test-form.component';
import { EndToEndTestComponent } from './end-to-end-test/end-to-end-test.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'applications/:id', component: ApplicationComponent },
  { path: 'applications/:id/end-to-end-tests/new', component: EndToEndTestFormComponent },
  { path: 'end-to-end-tests/:id', component: EndToEndTestComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
