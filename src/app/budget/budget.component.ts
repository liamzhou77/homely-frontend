import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
})
export class BudgetComponent implements OnInit {

  budgets: IBudget[] = [];

  constructor() {
    this.budgets.push(
      { budgetId: 1, budgetName: "August 2021" },
      { budgetId: 2, budgetName: "September 2021" },
      { budgetId: 3, budgetName: "October 2021" },
      { budgetId: 4, budgetName: "November 2021" },

    );

  }

  showFiller: boolean = true;
  currentBudgetId: number = 1;

  ngOnInit(): void { }


  setBudgetView(budgetId: number) {
    this.currentBudgetId = budgetId;
  }
}

export interface IBudget {
  budgetId: number,
  budgetName: string
}
