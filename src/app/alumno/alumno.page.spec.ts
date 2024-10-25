import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnoPage } from './alumno.page';
import { IonicModule } from '@ionic/angular';

describe('AlumnoPage', () => {
  let component: AlumnoPage;
  let fixture: ComponentFixture<AlumnoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlumnoPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
