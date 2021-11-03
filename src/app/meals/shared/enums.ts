export interface Meal {
  mealId?: number;
  recipeId: number;
  recipeName?: string;
  scheduledDate: Date;
  mealType: string;
}

export interface Recipe {
  recipeId?: number;
  recipeName: string;
  instructions: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  ingredientId?: number;
  amount: number;
  unitOfMeasurement: string;
  recipeId?: number;
  foodName: string;
}

export interface GroceryListItem {
  itemId?: number;
  foodName: string;
  createdBy: string;
  checkedOff: boolean;
  checkedOffBy: string;
  quantity: number;
  unitOfMeasurement: string;
  generated: boolean;
}

export interface DeletedAndGeneratedItems {
  deletedIDs: number[];
  generatedItems: GroceryListItem[];
}
