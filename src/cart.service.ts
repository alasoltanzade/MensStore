import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Post } from "./model/post.model";

export interface CartItem {
  post: Post;
  quantity: number;
}

@Injectable({ providedIn: "root" })
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const stored = localStorage.getItem("cart");
    if (stored) {
      this.cartItems = JSON.parse(stored);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartItemsSync(): CartItem[] {
    return this.cartItems;
  }

  addToCart(post: Post): void {
    const existingItem = this.cartItems.find((item) => item.post.id === post.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ post, quantity: 1 });
    }

    this.saveCartToStorage();
  }

  removeFromCart(postId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.post.id !== postId);
    this.saveCartToStorage();
  }

  updateQuantity(postId: number, quantity: number): void {
    const item = this.cartItems.find((item) => item.post.id === postId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(postId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage();
      }
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.post.year * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem("cart");
    this.cartSubject.next(this.cartItems);
  }

  isInCart(postId: number): boolean {
    return this.cartItems.some((item) => item.post.id === postId);
  }
}

