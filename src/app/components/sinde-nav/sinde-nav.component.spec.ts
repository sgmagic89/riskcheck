/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SindeNavComponent } from './sinde-nav.component';

describe('SindeNavComponent', () => {
  let component: SindeNavComponent;
  let fixture: ComponentFixture<SindeNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SindeNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SindeNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
