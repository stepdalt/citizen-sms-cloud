import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

import {
    COCIdentityModel, COCEventEmitterService, COCIdentityService,
    COCEnvironmentSettings
} from '../../coc-core';

import { environment } from '../../../environments/environment';
import { AdalService } from 'adal-angular4';
import { UserService } from 'src/app/services';
import { AppUser } from 'src/app/models';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

    title: string;
    smTitle: string;
    appEnv: string;
    user: AppUser;
    private _destroyed = new Subject();
    private _env: COCEnvironmentSettings;

    constructor(private router: Router,
        public currentUser: COCIdentityModel,
        private cocEmitterService: COCEventEmitterService,
        private changeDetector: ChangeDetectorRef,
        private _auth: COCIdentityService,
        private userService: UserService,
        private adalService: AdalService) {
        this._env = environment as COCEnvironmentSettings;
        this.title = this._env.application.appHeaderTitleLg;
        this.smTitle = this._env.application.appHeaderTitleSm;
        this.appEnv = this._env.environment;
    }

    ngOnInit() {
        // listen to another component's emitted event
        this.cocEmitterService.get('authChanged').pipe(takeUntil(this._destroyed)).subscribe((data) => {
            // apply changes in data (ie: auth details were updated)
            this.changeDetector.detectChanges();
        });
        if (this.adalService.userInfo.authenticated) {
            this.userService.getUser().subscribe(user => this.user = user );
        }
    }

    ngOnDestroy() {
        // remove event listener
        this.cocEmitterService.delete('authChanged');
        this._destroyed.next();
        this._destroyed.complete();
    }

    /**
     * @param e - Mouse event
     * @returns none
     * this function handles menu clicks
     */
    menuNav(url) {
        // switch view
        this.router.navigate([url]);
    }

    onLogoClick() {
        this.router.navigate(['']);
    }

    /**
     * user has clicked on account profile button
     */
    onProfile() {
        // switch view
        this.router.navigate(['/profile']);
    }

    /**
     * logout of the application and return to the login page
     */
    signout() {
        this.adalService.logOut();
    }
}
