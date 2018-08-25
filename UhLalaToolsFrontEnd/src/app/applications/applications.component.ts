import { Component, OnInit } from '@angular/core';

import { Application, APPLICATIONS } from '../models/application';

declare const $: any;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: Application[];
  newApplication: Application;

  constructor() {
    this.applications = [];
    this.newApplication = new Application('', '');
  }

  ngOnInit() {
    this.getApplications();
  }

  private getApplications() {
    this.applications = APPLICATIONS;
  }

  onCloseForm() {
    this.resetNewApplicationModel();
  }

  onSubmit() {
    $('#applicationFormModal').modal('hide');
    this.applications.push(this.newApplication);
    this.resetNewApplicationModel();
  }

  private resetNewApplicationModel() {
    this.newApplication = new Application('', '');
  }
}
