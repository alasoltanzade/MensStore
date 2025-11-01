import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { PostService } from "../../../post.service";
import { UserStats } from "../../../model/user-stats.model";
import { Post } from "../../../model/post.model";
import { Router } from "@angular/router";
import { HeaderComponent } from "../../header/header.component";
import { MessageService } from "primeng/api";
import { FileUpload, FileUploadEvent } from "primeng/fileupload";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FileUpload,
    ToastModule,
  ],
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
  providers: [MessageService],
})
export class CreateComponent implements OnInit {
  uploadedFiles: any[] = [];
  username: string = "";
  userStats: UserStats = {
    postCount: 0,
    followers: 0,
    following: 0,
  };
  postForm!: FormGroup;
  isLoading = false;
  uploadedImageUrl: string = "";

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem("username") || "";
    this.initForm();
    this.loadUserStats();
  }

  private initForm() {
    this.postForm = this.fb.group({
      instrument: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(6)]],
      year: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  // getters
  get instrumentControl(): AbstractControl {
    return this.postForm.get("instrument")!;
  }
  get descriptionControl(): AbstractControl {
    return this.postForm.get("description")!;
  }
  get yearControl(): AbstractControl {
    return this.postForm.get("year")!;
  }

  addPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const newPost: Post = {
      instrument: this.postForm.value.instrument,
      description: this.postForm.value.description,
      year: this.postForm.value.year,
      username: this.username,
      date: new Date().toISOString(),
      imageUrl: this.uploadedImageUrl,
      id: 0,
      name: "",
    };

    this.postService.createPost(newPost).subscribe({
      next: () => {
        this.postForm.reset();
        this.loadUserStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Post creation failed!", err);
        this.isLoading = false;
      },
    });
  }

  loadUserStats() {
    this.postService.getUserStats(this.username).subscribe({
      next: (stats: UserStats) => {
        this.userStats = {
          postCount: stats.postCount ?? 0,
          followers: stats.followers ?? 0,
          following: stats.following ?? 0,
        };
      },
      error: (err) => {
        console.error("Failed to load user stats", err);
        this.resetUserStats();
      },
    });
  }

  private resetUserStats() {
    this.userStats = { postCount: 0, followers: 0, following: 0 };
  }

  logout(): void {
    this.postService.logout().subscribe({
      next: () => {
        console.log("با موفقیت خارج شدید");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("current_user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        console.error("خطا در خروج:", err);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("current_user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        this.router.navigate(["/login"]);
      },
    });
  }

  onUpload(event: any) {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.uploadedImageUrl = reader.result as string;
      console.log("📸 Image URL (Base64):", this.uploadedImageUrl);

      this.messageService.add({
        severity: "success",
        summary: "آپلود موفق",
        detail: "عکس با موفقیت بارگذاری شد.",
      });
    };

    reader.onerror = (err) => {
      console.error("File read error:", err);
      this.messageService.add({
        severity: "error",
        summary: "خطا در آپلود",
        detail: "خواندن فایل انجام نشد.",
      });
    };

    reader.readAsDataURL(file);
  }
}
