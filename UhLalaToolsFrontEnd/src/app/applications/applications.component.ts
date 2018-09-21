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
  platforms: string[] = ['Web', 'Mobile'];
  browsers: {option: string, value: string}[] = [{option: 'Chrome', value: 'chrome'}];

  constructor(private applicationService: ApplicationService) {
    this.applications = [];
    this.newApplication = new Application('', this.platforms[0], 1);
  }

  ngOnInit() {
    this.getApplications();
  }

  onChangePlatform() {
    if (this.newApplication.platform === 'Web') {
      this.newApplication.browsers = [this.browsers[0].value];
    }
  }

  private getApplications() {
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
    this.newApplication = new Application('', this.platforms[0], 1);
  }
}
