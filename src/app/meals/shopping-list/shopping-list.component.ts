import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GroceryListItem } from '../shared/enums';
import { GroceryListService } from '../shared/grocery-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit {
  @Input() public householdId: number;
  @Input() public userId: number;

  public checkedItems: GroceryListItem[] = [];
  public uncheckedItems: GroceryListItem[] = [];
  public itemName: string;
  public itemQuantity: number;
  public itemUnit = '';

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

  public range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private groceryListService: GroceryListService) {}

  ngOnInit(): void {
    this.getGroceryListItems();
  }

  public getGroceryListItems() {
    this.groceryListService
      .getGroceryList(this.householdId)
      .subscribe((items) => {
        this.checkedItems = items.filter((i) => i.checkedOff);
        this.uncheckedItems = items.filter((i) => !i.checkedOff);
      });
  }

  public export(): void {
    this.groceryListService
      .generateGroceryList(
        this.householdId,
        this.range.value.start,
        this.range.value.end,
        this.userId
      )
      .subscribe((deletedAndGeneratedItems) => {
        this.getGroceryListItems();
      });
  }

  public setCompleted(item: GroceryListItem): void {
    this.groceryListService
      .checkGroceryListItem(item.itemId, this.userId)
      .subscribe(() => {
        item.checkedOff = !item.checkedOff;
        if (!item.checkedOff) {
          this.checkedItems = this.checkedItems.filter(
            (i) => i.itemId !== item.itemId
          );
          this.uncheckedItems.push(item);
        } else {
          this.uncheckedItems = this.uncheckedItems.filter(
            (i) => i.itemId !== item.itemId
          );
          this.checkedItems.push(item);
        }
      });
  }

  public deleteItem(item: GroceryListItem): void {
    this.groceryListService.deleteGroceryListItem(item.itemId).subscribe(() => {
      if (item.checkedOff) {
        this.checkedItems = this.checkedItems.filter(
          (i) => i.itemId !== item.itemId
        );
      } else {
        this.uncheckedItems = this.uncheckedItems.filter(
          (i) => i.itemId !== item.itemId
        );
      }
    });
  }

  public addItem(): void {
    this.groceryListService
      .addGroceryListItem({
        householdId: this.householdId,
        name: this.itemName,
        createdBy: this.userId,
        quantity: this.itemQuantity,
        unitOfMeasurement: this.itemUnit,
      })
      .subscribe(() => {
        this.getGroceryListItems();
        this.itemName = undefined;
        this.itemQuantity = undefined;
        this.itemUnit = '';
      });
  }
}
