import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AddMealComponent } from './add-meal/add-meal.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { MealsRoutingModule } from './meals-routing.module';
import { MealsComponent } from './meals.component';
import { RecipeComponent } from './recipe/recipe.component';
import { MealComponent } from './meal/meal.component';

@NgModule({
  declarations: [
    MealsComponent,
    AddRecipeComponent,
    RecipeComponent,
    AddMealComponent,
    MealComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MealsRoutingModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class MealsModule {}
