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
import { Post } from "../../../model/post.model";
import { Router } from "@angular/router";
import { HeaderComponent } from "../../header/header.component";
import { MessageService } from "primeng/api";
import { FileUpload } from "primeng/fileupload";
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
  }

  private initForm() {
    this.postForm = this.fb.group({
      instrument: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      year: [
        "",
        [Validators.required, Validators.min(0), Validators.max(100000000)],
      ],
      category: ["", [Validators.required]],
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
  get categoryControl(): AbstractControl {
    return this.postForm.get("category")!;
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
      category: this.postForm.value.category,
    };

    this.postService.createPost(newPost).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "موفق",
          detail: "محصول با موفقیت اضافه شد.",
        });
        this.postForm.reset();
        this.uploadedImageUrl = "";
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Post creation failed!", err);
        this.messageService.add({
          severity: "error",
          summary: "خطا",
          detail: "خطا در اضافه کردن محصول. لطفا دوباره تلاش کنید.",
        });
        this.isLoading = false;
      },
    });
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
