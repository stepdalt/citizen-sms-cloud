import { HostListener, Directive } from '@angular/core';
import { Observable } from 'rxjs';

@Directive()
export abstract class CanComponentDeactivate {

  abstract  canDeactivate(): Observable<boolean> | boolean;

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = true;
        }
    }
}
