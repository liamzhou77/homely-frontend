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
import { IBudget, IBudgetCategory, IExpense, IIncome } from '../../shared/dtos/budget-dtos';
import { IUserDto } from '../../shared/dtos/user-dto';
import { BudgetClient } from '../../shared/restClients/budget-client';
import { HouseholdClient } from '../../shared/restClients/household-client';
import { EditBudgetSettingsComponent } from '../edit-budget-settings/edit-budget-settings.component';

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
    this.incomes = budget.incomes;
    this.currentBudget = budget;
    //clean chart
    this.chartOptions.series = Object.assign([], []);
    this.chartOptions.labels = Object.assign([], []);
    this.incomeChartOptions.series = Object.assign([], []);
    this.incomeChartOptions.labels = Object.assign([], []);
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

      let newCategoryTotalPercentage = (total / category.idealAmount) * 100;
      this.categoryTotals.push(total);
      this.chartOptions.series.push(newCategoryTotalPercentage);
      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);
    })

    this.incomes.forEach(income => {
      this.incomeChartOptions.series.push(income.amount);
      this.incomeChartOptions.labels.push(income.name);
      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);
    })
  }

  categoryTotals: number[] = [];

  currentBudget: IBudget;
  householdId: number;
  userId: number;

  categories: IBudgetCategory[] = [];
  incomes: IIncome[] = [];

  displayedCategory: IBudgetCategory;

  householdMembers: IUserDto[] = [];

  addExpenseForm: FormGroup;
  addExpenseCategoryForm: FormGroup;
  addIncomeForm: FormGroup;

  ngOnInit(): void {
    this.addExpenseForm = new FormGroup({
      categoryName: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
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

  constructor(private modalService: MatDialog, private budgetClient: BudgetClient, private authService: AuthService, private householdClient: HouseholdClient) {

    this.authService.userInfoChanged.subscribe(userInfo => {
      this.householdId = userInfo.householdID;
      this.userId = userInfo.userID;
      this.householdClient.getHouseholdMembers(userInfo.householdID).subscribe(members => {
        this.householdMembers = members;
      })
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
      idealAmount: this.addExpenseCategoryForm.controls.categoryLimit.value
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
    if (this.addExpenseForm.controls.amount.value == null || this.addExpenseForm.controls.name.value == null)
      return;

    let newExpense: IExpense = {
      name: this.addExpenseForm.controls.name.value,
      userId: this.userId,
      amount: this.addExpenseForm.controls.amount.value,
      budgetCategoryId: this.displayedCategory.budgetCategoryId,

    }

    this.budgetClient.createExpense(newExpense).subscribe(response => {
      newExpense.id = response.id;

      let categoryIndex = this.chartOptions.labels.findIndex(x => x == this.categories.find(x => x.budgetCategoryId == this.displayedCategory.budgetCategoryId).budgetCategoryName);

      this.categories[categoryIndex].expenses.push(newExpense)

      let categoryTotal = this.categoryTotals[categoryIndex];

      let categoryLimit = this.categories[categoryIndex].idealAmount;

      this.categoryTotals[categoryIndex] = categoryTotal + this.addExpenseForm.controls.amount.value;

      let newCategoryTotalPercentage = (this.categoryTotals[categoryIndex] / categoryLimit) * 100;

      this.chartOptions.series[categoryIndex] = newCategoryTotalPercentage;


      this.chartOptions.series = Object.assign([], this.chartOptions.series);
      this.chartOptions.labels = Object.assign([], this.chartOptions.labels);

      this.addExpenseForm.controls.categoryName.setValue('')
      this.addExpenseForm.controls.name.setValue('')
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

      let categoryLimit = this.categories[categoryIndex].idealAmount;

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
    let newIncome: IIncome = {
      budgetId: this.currentBudget.budgetId,
      name: this.addIncomeForm.controls.incomeName.value,
      amount: this.addIncomeForm.controls.incomeAmount.value,
      userId: this.userId
    }

    this.budgetClient.createIncome(newIncome).subscribe(response => {

      this.incomeChartOptions.series.push(this.addIncomeForm.controls.incomeAmount.value)
      this.incomeChartOptions.labels.push(this.addIncomeForm.controls.incomeName.value)

      this.incomeChartOptions.series = Object.assign([], this.incomeChartOptions.series);
      this.incomeChartOptions.labels = Object.assign([], this.incomeChartOptions.labels);

      newIncome.id = response.id;

      this.incomes.push(newIncome);
    })

  }


  deleteIncome(income: IIncome) {

    this.budgetClient.deleteIncome(income.id).subscribe(() => {

      let incomeIndex = this.incomes.findIndex(i => income.id == i.id);

      this.incomeChartOptions.series.splice(incomeIndex, 1);
      this.incomeChartOptions.labels.splice(incomeIndex, 1);
      this.incomes.splice(incomeIndex, 1);

      this.incomeChartOptions.series = Object.assign([], this.incomeChartOptions.series);
      this.incomeChartOptions.labels = Object.assign([], this.incomeChartOptions.labels);
    });

  }

  editBudgetSettingsModal() {
    const modalRef = this.modalService.open(EditBudgetSettingsComponent, { data: this.currentBudget });
    modalRef.afterClosed().subscribe(() => {

      modalRef.componentInstance.newBudget.accesses.forEach(async a => {
        if (!this.currentBudget.accesses.includes(a)) {
          await this.budgetClient.createAccess(this.currentBudget.budgetId, a).subscribe();
        }
      })

      this.currentBudget.accesses.forEach(async a => {

        if (!modalRef.componentInstance.newBudget.accesses.includes(a)) {
          await this.budgetClient.deleteAccess(this.currentBudget.budgetId, a).subscribe();
        }
      });

      this.currentBudget.accesses = modalRef.componentInstance.newBudget.accesses;

      this.currentBudget.startDate = modalRef.componentInstance.newBudget.startDate;
      this.currentBudget.endDate = modalRef.componentInstance.newBudget.endDate;
      this.currentBudget.name = modalRef.componentInstance.newBudget.name;




      this.budgetClient.modifyBudget(this.currentBudget).subscribe(() => {

      })

     
    })
  }
}

