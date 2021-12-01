import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showValidation = false;
  validLogin: boolean;
  submitted = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.authService.getUserProfile();

    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });

    this.authService.loginSuccessful$.subscribe(
      (val) => {
        
        this.validLogin = val;
        if (!this.validLogin) {
          this.f.email.setErrors({ incorrect: true });
          this.f.password.setErrors({ incorrect: true });
        } else {
          this.f.email.setErrors(null);
          this.f.password.setErrors(null);
        }
      },
      (err) => {
        
        this.validLogin = false;
        this.f.email.setErrors({ incorrect: true });
        this.f.password.setErrors({ incorrect: true });
      },
    );
  }

  get f(): FormGroup['controls'] {
    return this.loginForm.controls;
  }

  login(): void {
    this.submitted = true;
    this.authService.login({
      email: this.f.email.value,
      password: this.f.password.value,
    });
  }

  onFocusHandler(): void {
    this.submitted = false;
    if (this.f.email.value !== '') {
      this.f.email.setErrors(null);
    }
    if (this.f.password.value !== '') {
      this.f.password.setErrors(null);
    }
  }
  showFeedback(): boolean {
    return (
      this.submitted &&
      ((!this.f.email.valid && this.f.email.touched) ||
        (!this.f.password.valid && this.f.password.touched))
    );
  }
}
