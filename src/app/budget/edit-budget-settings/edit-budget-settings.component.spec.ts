import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetSettingsComponent } from './edit-budget-settings.component';

describe('EditBudgetSettingsComponent', () => {
  let component: EditBudgetSettingsComponent;
  let fixture: ComponentFixture<EditBudgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBudgetSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBudgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
