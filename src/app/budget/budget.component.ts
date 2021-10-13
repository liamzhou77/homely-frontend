import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../core/auth-service.component';
import { IBudget } from '../shared/dtos/budget-dtos';
import { BudgetClient } from '../shared/restClients/budget-client';
import { CreateBudgetComponent } from './create-budget/create-budget.component';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit {

  budgets: IBudget[] = [];
  householdId: number;
  userId: number;

  constructor(private authService: AuthService,
    private budgetClient: BudgetClient,
    private modalService: MatDialog) {
    this.authService.userInfoChanged.subscribe(userInfo => {
      this.householdId = userInfo.householdID;
      this.userId = userInfo.userID;

      budgetClient.getBudgets(this.userId).subscribe(budgets => {
        this.budgets = budgets;
      })


    })
    
  }

  showFiller: boolean = true;
  currentBudget: IBudget;

  ngOnInit(): void { }


  createBudgetModal() {
    const modalRef = this.modalService.open(CreateBudgetComponent);
    modalRef.afterClosed().subscribe(() => {
      let newBudget = modalRef.componentInstance.newBudget;
      newBudget.ownerId = this.userId;
      this.budgetClient.createBudget(newBudget).subscribe(() => {
        this.budgetClient.getBudgets(this.userId).subscribe(budgets => {
          this.budgets = budgets;

        })
      });
    })

  }


  setBudgetView(budget: IBudget) {
    this.currentBudget = budget;
  }
}
