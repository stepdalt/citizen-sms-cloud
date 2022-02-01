import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let router: Router;
  const routerStub = {
    navigate: () => ({}),
    events: () => of( new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login'))
  };

  // class routerStub {
  //   // Router
  //   public events = of( new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login'));
  // }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      providers: [
        { provide: Router, useValue: routerStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get( Router);
    fixture.detectChanges();
  });

  // TODO: events.pipe error
  xit('should create', () => {
    const routerlyStub: Router = fixture.debugElement.injector.get(Router);
    // spyOn(routerlyStub as Router, 'events').and.callThrough();
    expect(component).toBeTruthy();
  });
});
