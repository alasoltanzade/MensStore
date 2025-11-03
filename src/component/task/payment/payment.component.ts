import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { CartService } from "../../../cart.service";

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  cardNumber: string = "";
  cvv: string = "";
  showSuccess: boolean = false;
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.totalPrice = this.cartService.getTotalPrice();
  }

  processPayment(): void {
    this.showSuccess = true;
    setTimeout(() => {
      this.cartService.clearCart();
      this.router.navigate(["/dashbord"]);
    }, 3000);
  }
}

