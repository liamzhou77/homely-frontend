import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { parseISO } from 'date-fns';
import format from 'date-fns/format';
import { AuthService } from '../../core/auth-service.component';
import { IBudget } from '../../shared/dtos/budget-dtos';
import { IUserDto } from '../../shared/dtos/user-dto';
import { HouseholdClient } from '../../shared/restClients/household-client';

@Component({
  selector: 'app-edit-budget-settings',
  templateUrl: './edit-budget-settings.component.html',
  styleUrls: ['./edit-budget-settings.component.css']
})
export class EditBudgetSettingsComponent implements OnInit {

  budgetForm: FormGroup;
  newBudget: IBudget;
  householdId: number;
  userId: number;
  householdMembers: IUserDto[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: IBudget,
    private dialogRef: MatDialogRef<EditBudgetSettingsComponent>,
    private authService: AuthService,
    private householdClient: HouseholdClient) {

    this.authService.userInfoChanged.subscribe(userInfo => {
      this.householdId = userInfo.householdID;
      this.userId = userInfo.userID;
      this.householdClient.getHouseholdMembers(userInfo.householdID).subscribe(members => {
        this.householdMembers = members;
      })
    })

    this.newBudget = data;

  }

  ngOnInit(): void {
    this.budgetForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
      accessors: new FormControl(null, Validators.required)
    });


    this.budgetForm.controls.name.setValue(this.data.name);
    this.budgetForm.controls.start.setValue(format(new Date(this.data.startDate),"yyyy-MM-dd"));
    this.budgetForm.controls.end.setValue(format(new Date(this.data.endDate), "yyyy-MM-dd"));
    this.budgetForm.controls.accessors.setValue(this.data.accesses);

  }

  submitBudget() {
    this.newBudget = {
      name: this.budgetForm.controls.name.value,
      startDate: this.budgetForm.controls.start.value,
      endDate: this.budgetForm.controls.end.value,
      accesses: this.budgetForm.controls.accessors.value
    }
    this.dialogRef.close();

  }
}
