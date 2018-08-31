import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApplicationService } from '../services/application.service';

import { Application } from '../models/application';
import { Test } from '../models/test';
import { EndToEndTest } from '../models/end-to-end-test';
import { COMMAND_TYPES, EndToEndTestCommand } from '../models/end-to-end-test-command';

@Component({
  selector: 'app-end-to-end-test-form',
  templateUrl: './end-to-end-test-form.component.html',
  styleUrls: ['./end-to-end-test-form.component.css']
})
export class EndToEndTestFormComponent implements OnInit {
  commandTypes = COMMAND_TYPES;
  application: Application;
  newEndToEndTest: EndToEndTest;

  constructor(private route: ActivatedRoute, private applicationService: ApplicationService) {
    const commands: EndToEndTestCommand[] = [
      new EndToEndTestCommand('', '')
    ];
    this.newEndToEndTest = new EndToEndTest(new Test('', ''), commands);
  }

  ngOnInit() {
    this.getApplication();
  }

  onSubmit() {
    console.log(this.newEndToEndTest);
  }

  onAddCommand() {
    this.newEndToEndTest.commands.push(new EndToEndTestCommand('', ''));
  }

  onRemoveCommand(index: number) {
    this.newEndToEndTest.commands.splice(index, 1);
  }

  private getApplication() {
    const id = this.route.snapshot.paramMap.get('id');
    this.applicationService.getApplication(id).subscribe((application) => {
      this.application = application;
    });
  }
}
