import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ChartComponent,
  ApexLegend
} from "ng-apexcharts";
import { AuthService } from '../../core/auth-service.component';
import { IBudget, IBudgetCategory, IExpense } from '../../shared/dtos/budget-dtos';
import { BudgetClient } from '../../shared/restClients/budget-client';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};

@Component({
  selector: 'app-edit-budget',
  templateUrl: './edit-budget.component.html',
  styleUrls: ['./edit-budget.component.css']
})
export class EditBudgetComponent implements OnInit {

  @Input()
  set budget(budget: IBudget) {
    this.categories = budget.budgetCategories;
    this.currentBudget = budget;
    //clean chart
    this.chartOptions.series = Object.assign([], []);
    this.chartOptions.labels = Object.assign([], []);
    this.displayedCategory = null;


    if (this.categories.length > 0)
      this.displayedCategory = this.categories[0];

    this.categories.forEach(category => {
      this.chartOptions.labels.push(category.budgetCategoryName);

      let total = 0;

      if (!category.expenses)
        category.expenses = [];
      category.expenses.forEach(expense => {
        total += expense.amount;
      })

      let newCategoryTotalPercentage = (total / category.percentageGoal) * 100;
      this.categoryTotals.push(total);
      this.chartOptions.series.push(newCategoryTotalPercentage);
      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);
    })    
  }

  categoryTotals: number[] = [];

  currentBudget: IBudget;
  householdId: number;
  userId: number;

  categories: IBudgetCategory[] = [];

  displayedCategory: IBudgetCategory;

  addExpenseForm: FormGroup;
  addExpenseCategoryForm: FormGroup;
  addIncomeForm: FormGroup;

  ngOnInit(): void {
    this.addExpenseForm = new FormGroup({
      categoryName: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
      expenseName: new FormControl(null, Validators.required),
    });

    this.addExpenseCategoryForm = new FormGroup({
      categoryName: new FormControl(null, Validators.required),
      categoryLimit: new FormControl(null, Validators.required)
    });


    this.addIncomeForm = new FormGroup({
      incomeName: new FormControl(null, Validators.required),
      incomeAmount: new FormControl(null, Validators.required)
    });

  }

  @ViewChild("chart", { static: false }) chart: ChartComponent;
  @ViewChild("incomeChart", { static: false }) incomeChart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;

  public incomeChartOptions: Partial<ChartOptions>;

  constructor(private modalService: MatDialog, private budgetClient: BudgetClient, private authService: AuthService) {

    this.authService.userInfoChanged.subscribe(userInfo => {
      this.householdId = userInfo.householdID;
      this.userId = userInfo.userID;
    })
    
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "radialBar",
        events: {
          dataPointSelection: (event, chart, config) => { this.selectedCategory(event, chart, config) },
          //dataPointMouseEnter: (event, chart, config) => { this.selectedCategory(event, chart, config) },
          legendClick: (chartContext, seriesIndex, config) => { this.legendClick(seriesIndex) }
        }  
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              fontSize: "22px",
              show: true,
            },
            value: {
              fontSize: "16px"
            },            
            total: {
              show: true,
              label: "Total Spent",
              formatter: (w) => {
                let total = 0;
                this.categories.forEach(category => {
                  if (!category.expenses)
                    category.expenses = [];
                  category.expenses.forEach(expense => {
                    total += expense.amount;
                  })
                })
                return total.toString() + "$";
              }
            }
          }
        }
      },
      labels: [],
      legend: {
        show: true,
        onItemClick: {
          toggleDataSeries: false
        },
      }
    };




    this.incomeChartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "donut",
        events: {
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              fontSize: "22px",
              show: true,
            },
            value: {
              fontSize: "16px"
            },
            total: {
              show: true,
              label: "Total Income",
              formatter: (w) => {
                return "10"
                //let total = 0;
                //this.categories.forEach(category => {
                //  if (!category.expenses)
                //    category.expenses = [];
                //  category.expenses.forEach(expense => {
                //    total += expense.amount;
                //  })
                //})
                //return total.toString() + "$";
              }
            }
          }
        }
      },
      labels: [],
      legend: {
        show: true,
        onItemClick: {
          toggleDataSeries: false
        },
      }
    };
  }

  addExpenseCategory() {
    //post the expense category for the budget to the api

    if (this.addExpenseCategoryForm.controls.categoryName.value == null || this.addExpenseCategoryForm.controls.categoryLimit.value == null)
      return;

    let newBudgetCategory: IBudgetCategory = {
      budgetId: this.currentBudget.budgetId,
      budgetCategoryName: this.addExpenseCategoryForm.controls.categoryName.value,
      color: "whatever",
      percentageGoal: this.addExpenseCategoryForm.controls.categoryLimit.value
    }

    this.budgetClient.createBudgetCategory(newBudgetCategory).subscribe(response => {
      newBudgetCategory.budgetCategoryId = response.id;
      newBudgetCategory.expenses = [];
      this.categories.push(newBudgetCategory);
      this.categoryTotals.push(0);


      this.chartOptions.labels.push(this.addExpenseCategoryForm.controls.categoryName.value);
      this.chartOptions.series.push(0);
      //this.categories.push(this.addExpenseCategoryForm.controls.categoryName.value)
      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);

      this.addExpenseCategoryForm.controls.categoryName.setValue('');
      this.addExpenseCategoryForm.controls.categoryLimit.setValue(null);

      if (this.displayedCategory == null) {
        this.displayedCategory = this.categories[0];


      }
    })
    
  }

  addExpense() {
    if (this.addExpenseForm.controls.amount.value == null || this.addExpenseForm.controls.expenseName.value == null)
      return;

    let newExpense: IExpense = {
      expenseName: this.addExpenseForm.controls.expenseName.value,
      createdBy: this.userId,
      amount: this.addExpenseForm.controls.amount.value,
      budgetCategoryId: this.displayedCategory.budgetCategoryId,

    }

    this.budgetClient.createExpense(newExpense).subscribe(response => {
      newExpense.id = response.id;

      let categoryIndex = this.chartOptions.labels.findIndex(x => x == this.categories.find(x => x.budgetCategoryId == this.displayedCategory.budgetCategoryId).budgetCategoryName);

      this.categories[categoryIndex].expenses.push(newExpense)

      let categoryTotal = this.categoryTotals[categoryIndex];

      let categoryLimit = this.categories[categoryIndex].percentageGoal;

      this.categoryTotals[categoryIndex] = categoryTotal + this.addExpenseForm.controls.amount.value;

      let newCategoryTotalPercentage = (this.categoryTotals[categoryIndex] / categoryLimit) * 100;

      this.chartOptions.series[categoryIndex] = newCategoryTotalPercentage;


      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);

      this.addExpenseForm.controls.categoryName.setValue('')
      this.addExpenseForm.controls.expenseName.setValue('')
      this.addExpenseForm.controls.amount.setValue('');

    })
  }


  selectedCategory(e: any, chart: any, options: any) {
    this.displayedCategory = this.categories[options.dataPointIndex];
  }

  legendClick(seriesIndex: any) {
    this.displayedCategory = this.categories[seriesIndex];
  }

  deleteExpense(expense: IExpense) {
    this.budgetClient.deleteExpense(expense.id).subscribe(() => {
      let categoryIndex = this.chartOptions.labels.findIndex(x => x == this.categories.find(x => x.budgetCategoryId == this.displayedCategory.budgetCategoryId).budgetCategoryName);

      this.categories[categoryIndex].expenses = this.categories[categoryIndex].expenses.filter(x => x.id != expense.id); //filter it out
      this.displayedCategory = this.categories[categoryIndex];

      let categoryTotal = this.categoryTotals[categoryIndex];

      let categoryLimit = this.categories[categoryIndex].percentageGoal;

      this.categoryTotals[categoryIndex] = categoryTotal - expense.amount;

      let newCategoryTotalPercentage = (this.categoryTotals[categoryIndex] / categoryLimit) * 100;

      this.chartOptions.series[categoryIndex] = newCategoryTotalPercentage;

      //this.chartOptions.chart.type = "donut";


      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);


    });
  }

  deleteCategory() {
    this.budgetClient.deleteCategory(this.displayedCategory.budgetCategoryId).subscribe(() => {
      let categoryIndex = this.chartOptions.labels.findIndex(x => x == this.categories.find(x => x.budgetCategoryId == this.displayedCategory.budgetCategoryId).budgetCategoryName);


      this.chartOptions.labels.splice(categoryIndex, 1);
      this.chartOptions.series.splice(categoryIndex, 1);
      this.categories.splice(categoryIndex, 1);
      this.categoryTotals.splice(categoryIndex, 1);

      if (this.categories.length > 0)
        this.displayedCategory = this.categories[0];
      else
        this.displayedCategory = null;


      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);
    });
  }

  addIncome() {
    this.incomeChartOptions.series.push(this.addIncomeForm.controls.incomeAmount.value)
    this.incomeChartOptions.labels.push(this.addIncomeForm.controls.incomeName.value)

    this.incomeChartOptions.series = Object.assign([], this.incomeChartOptions.series);
    this.incomeChartOptions.labels = Object.assign([], this.incomeChartOptions.labels);
  }
}

