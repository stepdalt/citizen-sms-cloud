import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AdalService } from 'adal-angular4';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private adalService: AdalService) { }

    canActivate(): boolean {
        if (this.adalService.userInfo.authenticated) {
            return true;
        } else {
            this.adalService.login();
        }
        return false;
    }

}