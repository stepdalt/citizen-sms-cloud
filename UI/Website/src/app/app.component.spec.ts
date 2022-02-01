import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { Helpers } from './shared/helpers';

xdescribe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const elementRefStub = {};
    const swUpdateStub = {
      isEnabled: true,
      available: { subscribe: () => ({}) },
      activateUpdate: () => ({ then: () => ({}) })
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AppComponent],
      providers: [
        Helpers,
        { provide: ElementRef, useValue: elementRefStub },
        { provide: SwUpdate, useValue: swUpdateStub }
      ]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });
  it('can instantiate the component', () => {
    expect(component).not.toBeNull();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const swUpdateStub: SwUpdate = fixture.debugElement.injector.get(
        SwUpdate
      );
      spyOn(swUpdateStub, 'activateUpdate');
      component.ngOnInit();
      // TODO - need to revisit how to enable this
      // expect(swUpdateStub.activateUpdate).toHaveBeenCalled();
    });
  });
});
