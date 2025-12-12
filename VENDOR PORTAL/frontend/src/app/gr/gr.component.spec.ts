import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrComponent } from './gr.component';

describe('GrComponent', () => {
  let component: GrComponent;
  let fixture: ComponentFixture<GrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
