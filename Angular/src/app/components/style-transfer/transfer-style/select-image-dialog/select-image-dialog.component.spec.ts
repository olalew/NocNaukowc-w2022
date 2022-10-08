import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSelectImageDialogComponent } from './select-image-dialog.component';

describe('SelectImageDialogComponent', () => {
  let component: TransferSelectImageDialogComponent;
  let fixture: ComponentFixture<TransferSelectImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferSelectImageDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TransferSelectImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
