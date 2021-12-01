import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { LoginComponent } from '../components/pages/login/login.component';

@NgModule({
  declarations: [LoginComponent],
  providers: [AuthGuard, AuthService],
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
})
export class AuthModule {}
