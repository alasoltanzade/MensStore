import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  get usernameControl() {
    return this.loginForm.get("username")!;
  }
  get passwordControl() {
    return this.loginForm.get("password")!;
  }

  navigateToLogin() {
    this.errorMessage = "";
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;

      this.http
        .get<any[]>("http://localhost:3000/users", {
          params: {
            username: username,
            password: password,
          },
        })
        .subscribe({
          next: (users) => {
            this.isLoading = false;
            if (users.length === 1) {
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("username", username);
              localStorage.setItem("auth_token", "token_" + Date.now());
              this.router.navigate(["/dashbord"]);
            } else {
              this.errorMessage = "نام کاربری یا رمز عبور اشتباه است!";
            }
          },
          error: () => {
            this.isLoading = false;
            this.errorMessage = "خطا در ارتباط با سرور! لطفاً دوباره تلاش کنید.";
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = "لطفاً تمامی فیلدها را پر کنید.";
    }
  }
}
