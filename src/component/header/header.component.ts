import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CartService } from "../../cart.service";
import { PostService } from "../../post.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount: number = 0;
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartSubscription = this.cartService.getCartItems().subscribe((items) => {
      this.cartItemsCount = this.cartService.getTotalItems();
    });
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
  }

  get isAdmin(): boolean {
    const username = localStorage.getItem("username");
    return username === "admin";
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  logout(): void {
    this.postService.logout().subscribe({
      next: () => {
        console.log("با موفقیت خارج شدید");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("current_user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        this.cartService.clearCart();
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        console.error("خطا در خروج:", err);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("current_user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        this.cartService.clearCart();
        this.router.navigate(["/login"]);
      },
    });
  }
}
