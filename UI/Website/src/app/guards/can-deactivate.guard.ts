import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmComponent } from '../components/confirm';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private dialog: MatDialog) {}

  /**
    * A guard to determine if a route can be deactivated.
    * A components must implement a canDeactivate() method
    * The method should return true/false (ex: if there are any unsaved edits to fields)
    * If false; a confirm dialog is shown
  **/
  canDeactivate(component: CanComponentDeactivate) {
    if (!component.canDeactivate()) {
      const confirmModalRef = this.dialog.open(ConfirmComponent, {
        disableClose: true,
        data: { title: 'Confirm Leaving', message: `You have unsaved changes! If you leave, 
          your changes will be lost. Do you want to proceed?`}
      });
      return confirmModalRef.afterClosed().pipe(map(result => {
        return result;
      }));
    } else {
      return true;
    }
  }
}
