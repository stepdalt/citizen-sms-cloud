import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { COCIdentityService, COCOauth2Service, COCEventEmitterService } from '../../coc-core';
import { HeaderComponent } from './header.component';
import { environment } from '../../../environments/environment';
import { COCEnvironmentSettings } from '../../coc-core/models';
import { of } from 'rxjs';

// Material libraries
import { MatMenuModule } from '@angular/material/menu';

describe('HeaderComponent', () => {
    let comp: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(() => {
        const changeDetectorRefStub = {
            detectChanges: () => ({})
        };
        const elementRefStub = {
            nativeElement: {
                querySelector: () => ({
                    classList: {
                        toggle: () => ({})
                    }
                })
            }
        };
        const routerStub = {
            navigate: () => ({})
        };
        const cOCOauth2ServiceStub = {
            getCurrentUser: () => ({})
        };
        const cOCEventEmitterServiceStub = {
            get: () => ({
                subscribe: () => ({})
            }),
            delete: () => ({})
        };
        const cOCIdentityServiceStub = {
            revoke: () => ({ subscribe: () => ({}) }),
            loginView: {},
            renew: () => {},
            logout:  () => {},
            isInteractive: () => false
        };
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [MatMenuModule],
            providers: [
                { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
                { provide: ElementRef, useValue: elementRefStub },
                { provide: Router, useValue: routerStub },
                { provide: COCOauth2Service, useValue: cOCOauth2ServiceStub },
                { provide: COCEventEmitterService, useValue: cOCEventEmitterServiceStub },
                { provide: COCIdentityService, useValue: cOCIdentityServiceStub },
            ]
        });
        fixture = TestBed.createComponent(HeaderComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('appEnv defaults to: environment.environment', () => {
        let _env: COCEnvironmentSettings;
        _env = environment as COCEnvironmentSettings;

        expect(comp.appEnv).toEqual(_env.environment);
    });

    describe('ngOnInit', () => {
        it('makes calls emitter service', () => {
            const cOCEventEmitterServiceStub: COCEventEmitterService = fixture.debugElement.injector.get(COCEventEmitterService);
            spyOn(cOCEventEmitterServiceStub, 'get').and.callThrough().and.returnValue(null);
            comp.ngOnInit();
            expect(cOCEventEmitterServiceStub.get).toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('makes calls emitter service', () => {
            const cOCEventEmitterServiceStub: COCEventEmitterService = fixture.debugElement.injector.get(COCEventEmitterService);
            spyOn(cOCEventEmitterServiceStub, 'delete');
            comp.ngOnDestroy();
            expect(cOCEventEmitterServiceStub.delete).toHaveBeenCalled();
        });
    });

    describe('menuNav', () => {
        it('makes calls to router', () => {
            const routerStub: Router = fixture.debugElement.injector.get(Router);
            spyOn(routerStub, 'navigate');

            comp.menuNav('mockRoute');

            expect(routerStub.navigate).toHaveBeenCalled();
        });
    });

    describe('onProfile', () => {
        it('makes calls to router', () => {
            const routerStub: Router = fixture.debugElement.injector.get(Router);
            spyOn(routerStub, 'navigate');
            comp.onProfile();
            expect(routerStub.navigate).toHaveBeenCalled();

        });
    });

    describe('signout', () => {
        it('makes calls to menuNav', () => {

            const cOCIdentityServiceStub: COCIdentityService = fixture.debugElement.injector.get(COCIdentityService);
            spyOn(cOCIdentityServiceStub, 'logout').and.returnValue(of(true));

            spyOn(comp, 'menuNav');
            comp.signout();
            expect(comp.menuNav).toHaveBeenCalled();

        });
    });

});
