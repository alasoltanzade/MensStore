import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const username = localStorage.getItem("username");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // بررسی اینکه کاربر لاگین شده باشد و admin باشد
  if (isLoggedIn && username === "admin") {
    return true;
  }

  // در غیر این صورت به داشبورد redirect می‌کند
  return router.navigate(["/dashbord"]);
};

