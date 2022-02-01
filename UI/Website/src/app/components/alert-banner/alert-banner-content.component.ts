import { Component, Inject, OnInit } from '@angular/core';

import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { AlertBanner } from '../../models';

/**
 * This component offers the actual content of the banner, wrapped in the above wrapper component
 */
@Component({
    selector: 'app-alert-banner-content',
    templateUrl: 'alert-banner-content.component.html',
    styleUrls: ['alert-banner-content.component.scss']
  })

export class AlertBannerContentComponent implements OnInit {
    constructor(
      public matSnackBar: MatSnackBar,
      @Inject(MAT_SNACK_BAR_DATA) public alertBanner: AlertBanner) {
    }

    ngOnInit() {
    }

    clear() {
      this.matSnackBar.dismiss();
    }

}
