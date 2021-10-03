import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-edit-budget',
  templateUrl: './edit-budget.component.html',
  styleUrls: ['./edit-budget.component.css']
})
export class EditBudgetComponent implements OnInit {

  @Input()
  set budgetId(budgetId: number) {
    
  }

  

  categories: string[] = [];
  categoryTotals: number[] = [];
  categoryLimits: number[] = [];
  expensesByCategory: IExpense[][] = [];

  displayedExpenses: IExpense[] = [];

  addExpenseForm: FormGroup;
  addExpenseCategoryForm: FormGroup;

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

  }

  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private modalService: MatDialog) {
    
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "radialBar",
        events: {
          dataPointSelection: (event, chart, config) => { this.selectedCategory(event, chart, config) }
        }
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px"
            },
            value: {
              fontSize: "16px"
            },
            total: {
              show: true,
              label: "Total Spent",
              formatter: (w) => {
                let total = 0;
                this.expensesByCategory.forEach(category => {
                  category.forEach(expense => {
                    total += expense.expenseAmount;
                  })
                })
                return total.toString() + "$";
              }
            }
          }
        }
      },
      labels: []
    };
  }

  addExpenseCategory() {
    //post the expense category for the budget to the api
    if (this.addExpenseCategoryForm.controls.categoryName.value == null || this.addExpenseCategoryForm.controls.categoryLimit.value == null)
      return;

    this.chartOptions.labels.push(this.addExpenseCategoryForm.controls.categoryName.value);
    this.categoryTotals.push(0);
    this.categoryLimits.push(this.addExpenseCategoryForm.controls.categoryLimit.value);
    this.chartOptions.series.push(0);
    this.categories.push(this.addExpenseCategoryForm.controls.categoryName.value)
    this.expensesByCategory.push([]);
    this.chartOptions.series = Object.assign([], this.chartOptions.series);
    this.chartOptions.labels = Object.assign([], this.chartOptions.labels);

    this.addExpenseCategoryForm.controls.categoryName.setValue('');
    this.addExpenseCategoryForm.controls.categoryLimit.setValue(null);
    
  }

  addExpense() {
    if (this.addExpenseForm.controls.categoryName == null || this.addExpenseForm.controls.amount == null || this.addExpenseForm.controls.expenseName == null)
      return;

    let categoryIndex = this.chartOptions.labels.findIndex(x => x == this.addExpenseForm.controls.categoryName.value);


    this.expensesByCategory[categoryIndex].push({
      expenseId: 1000, expenseAmount: this.addExpenseForm.controls.amount.value,
      expenseCategory: this.addExpenseForm.controls.categoryName.value,
      expenseName: this.addExpenseForm.controls.expenseName.value
    })

    let categoryTotal = this.categoryTotals[categoryIndex];
    let categoryLimit = this.categoryLimits[categoryIndex];

    this.categoryTotals[categoryIndex] = categoryTotal + this.addExpenseForm.controls.amount.value;
    let newCategoryTotalPercentage = (this.categoryTotals[categoryIndex] / categoryLimit) * 100;

    console.log(categoryIndex, categoryTotal, categoryLimit)
    console.log(newCategoryTotalPercentage);
    this.chartOptions.series[categoryIndex] = newCategoryTotalPercentage;


    this.chartOptions.series = Object.assign([], this.chartOptions.series);
    this.chartOptions.labels = Object.assign([], this.chartOptions.labels);

    this.addExpenseForm.controls.categoryName.setValue('')
    this.addExpenseForm.controls.expenseName.setValue('')
    this.addExpenseForm.controls.amount.setValue('');
  }


  selectedCategory(e: any, chart: any, options: any) {
    this.displayedExpenses = this.expensesByCategory[options.dataPointIndex];
  }

  //openAddCategoryForm() {
  //  const modalRef = this.modalService.open(AddBudgetExpenseCategoryComponent);

  //  modalRef.afterClosed().subscribe(() => {
  //    let categoryLimit = modalRef.componentInstance.categoryLimit;
  //    let categoryName = modalRef.componentInstance.categoryName;

  //    if (categoryName && categoryLimit) {
  //      //this.addExpenseCategory(categoryName, categoryLimit);

  //    }
  //  });
  //}
}


export interface IExpense {
  expenseId: number,
  expenseCategory: string,
  expenseName: string,
  expenseAmount: number,
}
