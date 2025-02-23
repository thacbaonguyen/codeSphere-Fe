import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloggerMemberComponent } from './blogger-member.component';

describe('BloggerMemberComponent', () => {
  let component: BloggerMemberComponent;
  let fixture: ComponentFixture<BloggerMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloggerMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloggerMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
