/*
To use this directive:
1. Add: [appRoleRestrict]="backOptions" to dom elements that you want to go back while ensuring
   the user doesn't leave the site after following a deep link; where the backOptions is a
   BackNavigationOptions object.
*/
import {Directive, HostListener, ElementRef, Input} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RouteHistoryService } from '../services';

/**
 * This directive provides a safe back navigation approach such that going back won't leave the site (or go to login screen)
 * but as long as the navigation is within the site normal back navigation is accepted.
 */

@Directive({
    selector: '[appSafeBackButton]'
})
export class SafeBackButtonDirective {
    el: ElementRef;
    backTarget: BackNavigationKeyValue;
    _options: BackNavigationOptions;
    routeService: RouteHistoryService;

    constructor(
        private router: Router,
        private location: Location,
        el: ElementRef,
        routeService: RouteHistoryService
        ) {
            this.el = el;
            this.routeService = routeService;
        }

    @HostListener('click', ['$event'])
    public onClick(event: any): void {
        this.router.navigate([`/${this.backTarget.url}`]);
    }
    @Input() set appSafeBackButton(options: BackNavigationOptions) {
        this._options = options;
        this.routeService.urlHistory.forEach(history => {
            this._options.backPathOptions.forEach(option => {
                if (history.indexOf(option.url) > -1) {
                    this.backTarget = option;
                    return;
                }
            });
            if (this.backTarget) {
                return;
            }
        });
        if (!this.backTarget) {
            this.backTarget = new BackNavigationKeyValue('Home', '');
        }

        this.el.nativeElement.innerHTML = this.backTarget.label;
        this.el.nativeElement.href = `/${this.backTarget.url}`;
    }
}

export class BackNavigationOptions {

    backPathOptions: [BackNavigationKeyValue];

    constructor(
        private _backPathOptions) {
            this.backPathOptions = _backPathOptions;
    }
  }

  export class BackNavigationKeyValue {

    label: string;
    url: string;

    constructor(
        private _label, private _url) {
            this.label = _label;
            this.url = _url;
    }
  }
