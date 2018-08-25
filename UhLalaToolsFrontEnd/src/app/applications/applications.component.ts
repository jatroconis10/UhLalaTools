import { Component, OnInit } from '@angular/core';

import { Application } from '../models/application';

import { ApplicationService } from '../services/application.service';

declare const $: any;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: Application[];
  newApplication: Application;

  constructor(private applicationService: ApplicationService) {
    this.applications = [];
    this.newApplication = new Application('', '');
  }

  ngOnInit() {
    this.getApplications();
  }

  private getApplications() {
    console.log(this.applicationService.getApplications)
    this.applicationService.getApplications().subscribe(
      applications => this.applications = applications
    );
  }

  onCloseForm() {
    this.resetNewApplicationModel();
  }

  onSubmit() {
    $('#applicationFormModal').modal('hide');
    this.applicationService.createApplication(this.newApplication).subscribe(
      application => this.applications.push(application)
    );
    this.resetNewApplicationModel();
  }

  private resetNewApplicationModel() {
    this.newApplication = new Application('', '');
  }
}
