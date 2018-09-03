import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxExpressionsComponent } from './ngx-expressions.component';

describe('NgxExpressionsComponent', () => {
  let component: NgxExpressionsComponent;
  let fixture: ComponentFixture<NgxExpressionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxExpressionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxExpressionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
