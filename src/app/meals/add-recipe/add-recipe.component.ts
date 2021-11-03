import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { zip } from 'rxjs';
import { Ingredient, Recipe } from '../shared/enums';
import { RecipesService } from '../shared/recipes.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css'],
})
export class AddRecipeComponent implements OnInit, OnChanges {
  @Input() public householdId: number;
  @Input() public isAdd: boolean;
  @Input() public oldRecipe: Recipe;

  public name: string;
  public instructions: string;

  public ingredientName: string;
  public ingredientQuantity: number;
  public ingredientUnit = '';

  public ingredients: Ingredient[] = [];

  public unitList = [
    'piece',
    'tsp',
    'tbsp',
    'fl oz',
    'gill',
    'cup',
    'pint',
    'quart',
    'gallon',
    'ml',
    'l',
    'dl',
    'lb',
    'oz',
    'mg',
    'g',
    'kg',
    'mm',
    'cm',
    'm',
    'inch',
  ];

  @Output() newRecipeEvent = new EventEmitter<never>();
  @Output() updateRecipeEvent = new EventEmitter<Recipe>();

  constructor(private recipeService: RecipesService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (!this.isAdd) {
      this.name = this.oldRecipe.recipeName;
      this.instructions = this.oldRecipe.instructions;
      this.ingredients = [...this.oldRecipe.ingredients];
    } else {
      this.name = '';
      this.instructions = '';
      this.ingredients = [];
    }
  }

  public addRecipe(): void {
    const newRecipe = {
      recipeName: this.name,
      instructions: this.instructions,
      ingredients: this.ingredients,
    };
    this.recipeService.addRecipe(this.householdId, newRecipe).subscribe(() => {
      this.clearRecipeForm();
      this.newRecipeEvent.emit();
    });
  }

  public updateRecipe(): void {
    const newRecipe = this.oldRecipe;
    newRecipe.recipeName = this.name;
    newRecipe.instructions = this.instructions;

    const observables = [
      this.recipeService.updateRecipe(this.householdId, newRecipe),
    ];
    const addedIngredients = this.ingredients.filter(
      (i) => !this.isInIngredients(i.ingredientId, this.oldRecipe.ingredients)
    );
    const deletedIngredients = this.oldRecipe.ingredients.filter(
      (i) => !this.isInIngredients(i.ingredientId, this.ingredients)
    );
    addedIngredients.forEach((i) =>
      observables.push(
        this.recipeService.addIngredient({
          recipeId: this.oldRecipe.recipeId,
          ...i,
        })
      )
    );
    deletedIngredients.forEach((i) =>
      observables.push(this.recipeService.deleteIngredient(i.ingredientId))
    );

    zip(...observables).subscribe(() => {
      this.updateRecipeEvent.emit(newRecipe);
    });
  }

  private isInIngredients(id: number, ingredients: Ingredient[]): boolean {
    for (let ingredient of ingredients) {
      if (id === ingredient.ingredientId) {
        return true;
      }
    }
    return false;
  }

  public addIngredient() {
    this.ingredients.push({
      foodName: this.ingredientName,
      amount: this.ingredientQuantity,
      unitOfMeasurement: this.ingredientUnit,
    });
    this.clearIngredientForm();
  }

  public removeIngredient(ingredient: Ingredient) {
    this.ingredients = this.ingredients.filter((i) => i !== ingredient);
  }

  private clearRecipeForm() {
    this.name = '';
    this.instructions = '';
    this.ingredients = [];
    this.clearIngredientForm();
  }

  private clearIngredientForm() {
    this.ingredientName = '';
    this.ingredientQuantity = undefined;
    this.ingredientUnit = '';
  }
}
