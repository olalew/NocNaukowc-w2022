import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraActivityComponent } from './camera-activity.component';

describe('CameraActivityComponent', () => {
  let component: CameraActivityComponent;
  let fixture: ComponentFixture<CameraActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
