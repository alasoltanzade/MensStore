import { Routes } from "@angular/router";
import { authGuard } from "./auth.guard";
import { loginGuard } from "./login.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./component/task/task.component").then((c) => c.TaskComponent),
    canActivate: [loginGuard],
  },
  {
    path: "dashbord",
    loadComponent: () =>
      import("./component/task/dashbord/dashbord.component").then(
        (c) => c.TaskDashbordComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "create",
    loadComponent: () =>
      import("./component/task/create/create.component").then(
        (c) => c.CreateComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "testimonials",
    loadComponent: () =>
      import("./component/task/testimonials/testimonials.component").then(
        (c) => c.TestimonialsComponent
      ),
    canActivate: [authGuard],
  },

  {
    path: "about",
    loadComponent: () =>
      import("./component/task/about/about.component").then(
        (c) => c.AboutComponent
      ),
    canActivate: [authGuard],
  },
];
