import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMemberComponent } from './manager-member.component';

describe('ManagerMemberComponent', () => {
  let component: ManagerMemberComponent;
  let fixture: ComponentFixture<ManagerMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
