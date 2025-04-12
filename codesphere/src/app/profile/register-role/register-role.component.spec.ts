import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRoleComponent } from './register-role.component';

describe('RegisterRoleComponent', () => {
  let component: RegisterRoleComponent;
  let fixture: ComponentFixture<RegisterRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
