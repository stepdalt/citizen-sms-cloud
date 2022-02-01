import { Component, OnInit } from '@angular/core';

import { VERSION as COCVERSION } from '../../coc-core';

import { BackNavigationOptions } from 'src/app/directives/safe-back-button.directive';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent implements OnInit {
env = environment;
COCVersion = COCVERSION;
backOptions = new BackNavigationOptions([{label: 'Home', url: '/home'}]);
  constructor(
  ) {}

  ngOnInit() {}

}
