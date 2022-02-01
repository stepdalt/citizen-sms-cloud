/*
To use this component:
1. Import component
3. Reference component in constructor
4. call either:
.success(message);
.error(message);
.info(message);
.warn(message);
.clear();
*/

import { Component, OnInit, OnDestroy } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertBanner, AlertBannerType } from '../../models';

import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-alert-banner',
  template: `<app-alert-banner-content  *ngIf="reveal">`
})

export class AlertBannerComponent implements OnInit, OnDestroy {
  alertBanner: AlertBanner;
  reveal = false;

  private _destroyed = new Subject();

  constructor(public matSnackBar: MatSnackBar) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  success(message: string, showDuration?: number) {
    this.showAlertBanner(AlertBannerType.Success, message, showDuration);
  }

  error(message: string, showDuration?: number) {
    this.showAlertBanner(AlertBannerType.Error, message, showDuration);
  }

  info(message: string, showDuration?: number) {
    this.showAlertBanner(AlertBannerType.Info, message, showDuration);
  }

  warn(message: string, showDuration?: number) {
    this.showAlertBanner(AlertBannerType.Warning, message, showDuration);
  }

  private showAlertBanner(type: AlertBannerType, message: string, showDuration?: number) {
    this.alertBanner = new AlertBanner();
    this.alertBanner.message = message;
    this.alertBanner.type = type;
    this.alertBanner.typeName = AlertBannerType[this.alertBanner.type];

    // determine the css styles
    this.alertBanner.cssClass = this.cssClass(type);
    this.alertBanner.cssIconClass = this.cssIconClass(type);

    const snackRef = this.matSnackBar.openFromComponent(AlertBannerComponent, {
      duration: (showDuration !== undefined) ? showDuration : environment.application.defaultAlertTime,
      verticalPosition: 'top',
      panelClass: ['mat-snack-bar-handset'],
      data: this.alertBanner
    });

    // This event subscription is used to apply proper styling on the alert banner once it exists in
    // the DOM, and then triggers the reveal, this handles an issue with the style popping on
    snackRef.afterOpened().pipe(takeUntil(this._destroyed)).subscribe(() => {
      const elements = document.querySelectorAll('div.cdk-overlay-pane');
      // if snack bar exists
      Array.prototype.forEach.call(elements, function (element, i) {
        if (element.outerHTML.includes('mat-snack-bar-container')) {
          // add additional class to make the snack bar go full size of screen
          if (element.classList) {
          element.classList.add('mat-snack-bar-handset');
          } else {
          element.className += ' ' + 'mat-snack-bar-handset';
          }
        }
      });
      snackRef.instance.reveal = true;
    });
  }

  // return css class based on alertBanner type
  private cssClass(alertBannerType: AlertBannerType) {
    switch (alertBannerType) {
      case AlertBannerType.Success:
        return 'success';
      case AlertBannerType.Error:
        return 'warning';
      case AlertBannerType.Warning:
        return 'caution';
      // this might not exist anymore
      // case AlertBannerType.Miscellaneous:
      //   return 'miscellaneous';
      case AlertBannerType.Info:
        return 'information';
      default:
        return;
    }
  }

  // return css icon class based on alertBanner type
  private cssIconClass(alertBannerType: AlertBannerType) {
    switch (alertBannerType) {
      case AlertBannerType.Success:
        return 'cicon-check-circle';
      case AlertBannerType.Error:
        return 'cicon-exclamation-triangle';
      case AlertBannerType.Info:
        return 'cicon-exclamation-circle';
      case AlertBannerType.Warning:
        return 'cicon-exclamation-diamond';
      case AlertBannerType.Miscellaneous:
        return 'cicon-exclamation-circle';
      default:
        return;
    }
  }
}
