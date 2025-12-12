import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditdebitComponent } from './creditdebit.component';

describe('CreditdebitComponent', () => {
  let component: CreditdebitComponent;
  let fixture: ComponentFixture<CreditdebitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditdebitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditdebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
