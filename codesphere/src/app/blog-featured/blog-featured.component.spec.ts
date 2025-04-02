import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogFeaturedComponent } from './blog-featured.component';

describe('BlogFeaturedComponent', () => {
  let component: BlogFeaturedComponent;
  let fixture: ComponentFixture<BlogFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogFeaturedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
