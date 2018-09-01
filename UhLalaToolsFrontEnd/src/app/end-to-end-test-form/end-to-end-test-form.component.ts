import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApplicationService } from '../services/application.service';
import { EndToEndTestService } from '../services/end-to-end-test.service';

import { Application } from '../models/application';
import { Test } from '../models/test';
import { EndToEndTest } from '../models/end-to-end-test';
import { COMMAND_TYPES, EndToEndTestCommand, COMMAND_TYPES_VALUE_REQUIRED } from '../models/end-to-end-test-command';

@Component({
  selector: 'app-end-to-end-test-form',
  templateUrl: './end-to-end-test-form.component.html',
  styleUrls: ['./end-to-end-test-form.component.css']
})
export class EndToEndTestFormComponent implements OnInit {
  commandTypes = COMMAND_TYPES;
  commandTypesValueRequired = COMMAND_TYPES_VALUE_REQUIRED;
  application: Application;
  newEndToEndTest: EndToEndTest;

  constructor(private router: Router, private route: ActivatedRoute,
              private applicationService: ApplicationService,
              private endToEndTestService: EndToEndTestService) {
    const commands: EndToEndTestCommand[] = [
      new EndToEndTestCommand('', this.commandTypes[0])
    ];
    this.newEndToEndTest = new EndToEndTest(new Test('', ''), commands);
  }

  ngOnInit() {
    this.getApplication();
  }

  onSubmit() {
    this.endToEndTestService.createEndToEndTest(this.application._id, this.newEndToEndTest).subscribe(
      () => this.router.navigate([`applications/${this.application._id}`])
    );
  }

  onAddCommand() {
    this.newEndToEndTest.commands.push(new EndToEndTestCommand('', this.commandTypes[0]));
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
