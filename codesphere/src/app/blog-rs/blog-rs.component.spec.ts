import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogRsComponent } from './blog-rs.component';

describe('BlogRsComponent', () => {
  let component: BlogRsComponent;
  let fixture: ComponentFixture<BlogRsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogRsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogRsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
