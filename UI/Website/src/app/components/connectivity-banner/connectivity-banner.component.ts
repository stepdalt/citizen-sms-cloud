import { Component, OnInit, OnDestroy } from '@angular/core';
import { of, Subject, fromEvent, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-connectivity-banner',
    templateUrl: './connectivity-banner.component.html',
    styleUrls: ['./connectivity-banner.component.scss']
})

export class ConnectivityBannerComponent implements OnInit, OnDestroy {
    private _destroyed = new Subject();
    env = environment;
    onlineEvent: Observable<Event>;
    offlineEvent: Observable<Event>;
    isShowingConnectivityBanner = false;

    constructor(
    ) { }

    ngOnInit() {
        // check for online/offline
        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');

        this.onlineEvent.pipe(
            takeUntil(this._destroyed)
        ).subscribe(e => {
            // we're online - hide banner
            this.isShowingConnectivityBanner = false;
        });

        this.offlineEvent.pipe(
            takeUntil(this._destroyed)
        ).subscribe(e => {
            // we're offline - show banner
            this.isShowingConnectivityBanner = true;
        });
     }

     ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
}
