import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStyleComponent } from './transfer-style.component';

describe('TransferStyleComponent', () => {
  let component: TransferStyleComponent;
  let fixture: ComponentFixture<TransferStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferStyleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
