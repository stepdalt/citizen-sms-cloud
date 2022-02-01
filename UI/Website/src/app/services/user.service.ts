import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { COCEnvironmentSettings, COCLogger } from '../coc-core';

import { AppUser, AADUser } from '../models';

import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';


@Injectable()
export class UserService {
    private _env: COCEnvironmentSettings;
    private originUrl: string;
    private aadUser: AADUser;
    private user: AppUser;

    constructor(
        private http: HttpClient,
        private cocLogger: COCLogger,
        @Inject(DOCUMENT) private document: Document) {
        this._env = environment as COCEnvironmentSettings;
        this.originUrl = this.document.location.origin;
        this.user = new AppUser();
    }

    public getUser(): Observable<AppUser> {
        return this.http.get('/.auth/me').pipe(
            map(response => {
                try {
                    this.aadUser = response[0] as AADUser;
                    
                    this.user.userId = this.aadUser.user_id;
   
                    this.aadUser.user_claims.forEach(claim => {
                        switch (claim.typ) {
                            case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname":
                                this.user.firstName = claim.val;
                                break;
                            case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname":
                                this.user.lastName = claim.val;
                                break;
                            case "roles":
                                if (!this.user.roles) {
                                    this.user.roles = [claim.val];
                                } else {
                                    this.user.roles.push(claim.val);
                                }
                                break;
                        }
                    });
   
                    return this.user;
                }
                catch (Exception) {
                    console.log(`Error: ${Exception}`);
                }
            }),
            catchError((err) => {
                return throwError(err);
            })
        )
    }
}
