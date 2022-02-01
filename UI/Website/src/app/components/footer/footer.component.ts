import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, UrlSegment } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  today: number = Date.now();
  version = `${environment.version}`;
  isHidden = false;

  private _destroyed = new Subject();

  /**
   * The foot constructor listens for route changes so it can check if it should display or not.
   * This done this way because the footer doesn't reload on normal navigation, it is outside the
   * routing.
   */
  constructor(
    private router: Router,
    ) {
    const self = this;
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._destroyed)
    ).subscribe((event: NavigationEnd) => {
      const rig = router.config;
      Array.prototype.forEach.call(rig, function (routeParam, i) {
        const urlSegment: UrlSegment[] = [ new UrlSegment(event.url.replace('/', ''), {}) ];
        if (event.url.indexOf(routeParam.path) > -1 ||
        (routeParam.matcher &&
          routeParam.matcher(urlSegment) &&
          event.url.indexOf(routeParam.matcher(urlSegment).consumed[0].path) > -1)) {
          if (routeParam.data && routeParam.data.isHidden) {
            self.isHidden = true;
          } else {
            self.isHidden = false;
          }
        }
      });
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
