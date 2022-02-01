import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { Helpers } from './shared';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AdalService } from 'adal-angular4';

import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
    private _destroyed = new Subject();

    constructor(
        private updates: SwUpdate,
        private adalService: AdalService,
        private helpers: Helpers
    ) {
        this.adalService.init(environment.adalconfig);
        this.adalService.handleWindowCallback();
    }

    ngOnInit() {
        // handle PWA
        if (this.updates.isEnabled) {
            this.updates.available.pipe(
                takeUntil(this._destroyed)
            ).subscribe(() => {
                if (confirm('New version available. Load New Version?')) {
                    this.updates.activateUpdate().then(() => document.location.reload());
                }
            });
        }
    }

    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
}
