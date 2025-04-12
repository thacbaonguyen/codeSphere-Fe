import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteBlogComponent } from './write-blog.component';

describe('WriteBlogComponent', () => {
  let component: WriteBlogComponent;
  let fixture: ComponentFixture<WriteBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteBlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
