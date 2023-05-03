import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiService } from 'src/app/services/api.service';
import { ContribuyenteComponent } from './contribuyente.component';

// Fake class of ApiService
class MockApiService {
  isLoggedIn = true;
  user = { name: 'User' };
}

describe('ContribuyenteComponent', () => {
  let component: ContribuyenteComponent;
  let fixture: ComponentFixture<ContribuyenteComponent>;
  let comp: any;
  let apiService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContribuyenteComponent],
      providers: [
        ContribuyenteComponent,
        { provide: ApiService, useClass: MockApiService }
      ],
    })
      .compileComponents();

    // Inject both the component and the dependent service.
    comp = TestBed.inject(ContribuyenteComponent);
    apiService = TestBed.inject(ApiService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContribuyenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    //expect(apiService.user.name).toBe('User');
  });
});
