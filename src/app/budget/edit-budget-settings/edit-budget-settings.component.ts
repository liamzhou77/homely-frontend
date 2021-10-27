import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  }

  ngOnInit(): void {
    this.budgetForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
    });

  }

  submitBudget() {
    this.newBudget = {
      name: this.budgetForm.controls.name.value,
      startDate: this.budgetForm.controls.start.value,
      endDate: this.budgetForm.controls.end.value
    }

    this.dialogRef.close();


  }
}
