import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BEServicioPanelComponent } from './borrareditarservicio.component';

describe('BEServicioPanelComponent', () => {
  let component: BEServicioPanelComponent;
  let fixture: ComponentFixture<BEServicioPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BEServicioPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BEServicioPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
