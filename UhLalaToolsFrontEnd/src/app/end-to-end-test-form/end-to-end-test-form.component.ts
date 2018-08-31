import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApplicationService } from '../services/application.service';

import { Application } from '../models/application';
import { Test } from '../models/test';
import { EndToEndTest } from '../models/end-to-end-test';

@Component({
  selector: 'app-end-to-end-test-form',
  templateUrl: './end-to-end-test-form.component.html',
  styleUrls: ['./end-to-end-test-form.component.css']
})
export class EndToEndTestFormComponent implements OnInit {
  application: Application;
  newEndToEndTest: EndToEndTest;

  constructor(private route: ActivatedRoute, private applicationService: ApplicationService) {
    this.newEndToEndTest = new EndToEndTest(new Test('', ''));
  }

  ngOnInit() {
    this.getApplication();
  }

  onSubmit() {
    console.log(this.newEndToEndTest);
  }

  private getApplication() {
    const id = this.route.snapshot.paramMap.get('id');
    this.applicationService.getApplication(id).subscribe((application) => {
      this.application = application;
    });
  }
}
