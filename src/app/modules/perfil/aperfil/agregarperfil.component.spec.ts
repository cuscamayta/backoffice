import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APerfilPanelComponent } from './agregarperfil.component';



describe('APerfilPanelComponent', () => {
  let component: APerfilPanelComponent;
  let fixture: ComponentFixture<APerfilPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ APerfilPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(APerfilPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
