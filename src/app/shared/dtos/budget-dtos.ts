export interface IBudget {
  budgetId?: number,
  ownerId?: number,
  budgetName?: string,
  budgetStartDate?: Date,
  budgetEndDate?: Date,
  budgetCategories?: IBudgetCategory[],

}


export interface IBudgetCategory {
  budgetCategoryId?: number,
  budgetId?: number,
  budgetCategoryName?: string,
  color?: string,
  percentageGoal?: number
  expenses?: IExpense[],
}

export interface IExpense {
  id?: number,
  budgetCategoryId?: number,
  expenseName?: string,
  amount?: number,
  dateAdded?: Date,
  createdBy?: number
}


export interface IResponseDto {
  id: number;
}
