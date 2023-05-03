import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from 'src/app/services/api.service';
import { ProveedorComponent } from './proveedor.component';

// Fake class of ApiService
class MockApiService {
  url = 'La url'
}

describe('ProveedorComponent', () => {
  let component: ProveedorComponent;
  let fixture: ComponentFixture<ProveedorComponent>;
  let comp: any;
  let api: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProveedorComponent],
      providers: [
        ProveedorComponent,
        { provide: ApiService, useClass: MockApiService }
      ]
    })
      .compileComponents();

    // Inject both the component and the dependent service.
    comp = TestBed.inject(ProveedorComponent);
    api = TestBed.inject(ApiService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
    //expect(component.api.prueba).toBe('prueba');
  });
});
