import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarCPage } from './recuperar-c.page';

describe('RecuperarCPage', () => {
  let component: RecuperarCPage;
  let fixture: ComponentFixture<RecuperarCPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
