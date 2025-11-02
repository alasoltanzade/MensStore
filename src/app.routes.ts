import { Routes } from "@angular/router";
import { adminGuard } from "./admin.guard";

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
  },
  {
    path: "dashbord",
    loadComponent: () =>
      import("./component/task/dashbord/dashbord.component").then(
        (c) => c.TaskDashbordComponent
      ),
  },
  {
    path: "create",
    loadComponent: () =>
      import("./component/task/create/create.component").then(
        (c) => c.CreateComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: "testimonials",
    loadComponent: () =>
      import("./component/task/testimonials/testimonials.component").then(
        (c) => c.TestimonialsComponent
      ),
  },
  {
    path: "about",
    loadComponent: () =>
      import("./component/task/about/about.component").then(
        (c) => c.AboutComponent
      ),
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./component/task/cart/cart.component").then(
        (c) => c.CartComponent
      ),
  },
];
