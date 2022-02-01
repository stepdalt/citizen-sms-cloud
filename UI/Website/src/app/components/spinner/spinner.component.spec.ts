import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
    let comp: SpinnerComponent;
    let fixture: ComponentFixture<SpinnerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ SpinnerComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
            ]
        });
        fixture = TestBed.createComponent(SpinnerComponent);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

});
