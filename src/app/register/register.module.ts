import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from  '../material.module';
import { RegisterRoutingModule } from './register-routing.module';
 



@NgModule({
  declarations: [
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
