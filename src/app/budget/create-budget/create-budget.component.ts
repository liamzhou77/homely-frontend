import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IBudget } from '../../shared/dtos/budget-dtos';

@Component({
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.css']
})
export class CreateBudgetComponent implements OnInit {

  budgetForm: FormGroup;
  newBudget: IBudget;

  constructor(private dialogRef: MatDialogRef<CreateBudgetComponent>) { }

  ngOnInit(): void {
    this.budgetForm = new FormGroup({
      budgetName: new FormControl(null, Validators.required),
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
    });

  }

  submitBudget() {
    this.newBudget = {
      budgetName: this.budgetForm.controls.budgetName.value,
      budgetStartDate: this.budgetForm.controls.start.value,
      budgetEndDate: this.budgetForm.controls.end.value
    }

    this.dialogRef.close();

    
  }

}
