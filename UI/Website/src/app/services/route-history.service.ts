import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class RouteHistoryService {

    urlHistory = [];
    constructor(private route: Router) {
        this.routeEvent(this.route);
      }
      routeEvent(router: Router) {
        router.events.subscribe(e => {
          if (e instanceof NavigationEnd) {
            this.urlHistory.push(e.url);
            if (this.urlHistory.length > 3) {
                this.urlHistory.shift();
            }
          }
        });
      }
}