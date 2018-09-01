import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EndToEndTest } from '../models/end-to-end-test';

import { EndToEndTestService } from '../services/end-to-end-test.service';

@Component({
  selector: 'app-end-to-end-test',
  templateUrl: './end-to-end-test.component.html',
  styleUrls: ['./end-to-end-test.component.css']
})
export class EndToEndTestComponent implements OnInit {
  endToEndTest: EndToEndTest;

  constructor(private route: ActivatedRoute,
              private endToEndTestService: EndToEndTestService) { }

  ngOnInit() {
    this.getEndToEndTest();
  }

  getEndToEndTest() {
    const id = this.route.snapshot.paramMap.get('id');
    this.endToEndTestService.getEndToEndTest(id).subscribe((endToEndTest) => {
      this.endToEndTest = endToEndTest;
    });
  }
}
