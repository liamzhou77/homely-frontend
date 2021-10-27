export interface IBudget {
  budgetId?: number,
  userId?: number,
  name?: string,
  startDate?: Date,
  endDate?: Date,
  budgetCategories?: IBudgetCategory[],
  incomes?: IIncome[]
}


export interface IBudgetCategory {
  budgetCategoryId?: number,
  budgetId?: number,
  budgetCategoryName?: string,
  color?: string,
  percentageGoal?: number
  expenses?: IExpense[],
}

export interface IIncome {
  id?: number,
  budgetId?: number,
  name?: string,
  amount?: number,
  userId?: number,
  dateAdded?: Date
}

export interface IExpense {
  id?: number,
  budgetCategoryId?: number,
  name?: string,
  amount?: number,
  dateAdded?: Date,
  userId?: number
}


export interface IResponseDto {
  id: number;
}
