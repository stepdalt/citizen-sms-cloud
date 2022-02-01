import { Component, OnInit, AfterContentInit, OnDestroy,
    ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map, catchError, takeUntil } from 'rxjs/operators';
import { Observable, throwError, of, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { COCIdentityService, COCEventEmitterService, COCIdentityModel, IDENTITY_ERRORS,
    COCEnvironmentSettings, COCACFProvider, COCLogger } from '../../coc-core';

import { AlertBannerComponent } from '../alert-banner';
import { SpinnerComponent } from '../spinner';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy, AfterContentInit {

    model: any = {};
    returnUrl: string;
    didCocValidationInit: false;
    modalReference: any;
    loginForm: FormGroup;
    submitted = false;

    private _destroyed = new Subject();
    private _env: COCEnvironmentSettings;

    get isInteractive(): boolean {
        return this.auth.isInteractive;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private auth: COCIdentityService,
        private user: COCIdentityModel,
        private cocEmitterService: COCEventEmitterService,
        private cocLogger: COCLogger,
        private cocACF: COCACFProvider,
        private alertBannerComponent: AlertBannerComponent,
        private dialog: MatDialog,
        private changeDetector: ChangeDetectorRef,
        private fb: FormBuilder
    ) {
        this._env = environment as COCEnvironmentSettings;
        this.createForm();
    }

    createForm() {
        this.loginForm = this.fb.group({
          username: ['', Validators.required ],
          password: ['', Validators.required ]
       });
      }

    /**
     * function runs immediately
     */
    ngOnInit(): void {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    }

    /**
     * function runs when component is destroyed
     */
    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    /**
     * function checks PL validation first via DOM
     * then proceeds with login if passed
     */
    onValidate(username: string, password: string): void {
        this.submitted = true;
        this.loginForm.markAllAsTouched();
        this.loginForm.updateValueAndValidity({onlySelf: null, emitEvent: true});
        if (this.loginForm.valid) {
            this.onLogin(username, password);
        }
    }

    /**
     * user has clicked on the login submit button
     */
    onLogin(username?: string, password?: string): void {
        // Scrubbed
    }

    /**
     * function runs after page is component is rendered
     */
    ngAfterContentInit(): void {
        // if this is a non-interactive login form (i.e. kerberos, open token), then start the login process with no
        // user input
        if (!this.auth.isInteractive) {
            this.onLogin();
        }
    }
}
