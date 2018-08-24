import { Component, OnInit } from '@angular/core';

import { Application, APPLICATIONS } from '../models/application';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  applications: Application[];

  constructor() {
    this.applications = [];
  }

  ngOnInit() {
    this.getApplications();
  }

  private getApplications() {
    this.applications = APPLICATIONS;
  }
}
