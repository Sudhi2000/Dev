import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthenticationOtpComponent } from './authentication-otp/authentication-otp.component';

const routes: Routes = [
  {path:'',component:SignInComponent},
  {path:'signin',component:SignInComponent},
  {path:'reset-password/:token/:email/:id',component:ResetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
