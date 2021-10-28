import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators'
import { RegistrationModel } from '../shared/models/registrationModel';
import { AuthService } from '../core/auth-service.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  success: boolean;
  error: string;
  showForm: boolean = true;
  showSuccessMessage: boolean = false;
  registrationModel: RegistrationModel = { UserName: '', Email: '', Password: '', ConfirmPassword: '' };
  submitted: boolean = false;
  showSpinner: boolean = false;
  registrationForm = new FormGroup({
    UserName: new FormControl(null, Validators.required),
    Email: new FormControl(null, Validators.required ),
    Password: new FormControl(null, Validators.required),
    ConfirmPassword: new FormControl(null, Validators.required)
  });
  

  constructor(private _authService: AuthService) {
  
  }

  ngOnInit(): void {
    this.registrationForm.valueChanges.subscribe((formValues: RegistrationModel) => {
      this.updateFormValues(formValues);
    })

  }

  updateFormValues(formValues: RegistrationModel) {

    this.registrationModel.UserName = formValues.UserName;
    this.registrationModel.Email = formValues.Email;
    this.registrationModel.Password = formValues.Password;
    this.registrationModel.ConfirmPassword = formValues.ConfirmPassword;
    
    return;
  }

  register(data: any) {
    this.showSpinner = true;

    this._authService.register(data)
      .pipe(finalize(() => {
        this.showSpinner = false;
      }))  
      .subscribe(
        (result: any) => {
         if(result) {
           this.success = true;
           this.showForm = false;
           this.showSuccessMessage = true;

         }
      },
          (error: string) => {
        this.error = error;       
      });
    
  }

}
