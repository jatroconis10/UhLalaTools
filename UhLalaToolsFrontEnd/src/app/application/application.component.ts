import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Application, APPLICATIONS } from '../models/application';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  application: Application;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getApplication();
  }

  private getApplication() {
    const id = this.route.snapshot.paramMap.get('id');
    this.application = APPLICATIONS[id];
  }
}
