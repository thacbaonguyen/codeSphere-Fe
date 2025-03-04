import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCmtComponent } from './edit-cmt.component';

describe('EditCmtComponent', () => {
  let component: EditCmtComponent;
  let fixture: ComponentFixture<EditCmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
