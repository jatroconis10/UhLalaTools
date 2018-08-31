import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Application } from '../models/application';

import { ApplicationService } from '../services/application.service';
import { EndToEndTest, END_TO_END_TESTS } from '../models/end-to-end-test';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  application: Application;
  endToEndTests: EndToEndTest[];

  constructor(private route: ActivatedRoute, private applicationService: ApplicationService) {
  }

  ngOnInit() {
    this.getApplication();
  }

  private getApplication() {
    const id = this.route.snapshot.paramMap.get('id');
    this.applicationService.getApplication(id).subscribe((application) => {
      this.application = application;
      this.getApplicationTests();
    });
  }

  private getApplicationTests() {
    this.endToEndTests = END_TO_END_TESTS;
  }
}
