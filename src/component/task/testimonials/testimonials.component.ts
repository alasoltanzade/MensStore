import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { PostService } from "../../../post.service";
import { Post } from "../../../model/post.model";
import { ChangeDetectorRef } from "@angular/core";
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: "app-testimonials",
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: "./testimonials.component.html",
  styleUrls: ["./testimonials.component.scss"],
})
export class TestimonialsComponent implements OnInit {
  posts: Post[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  displayedPosts: Post[] = [];
  pagedPosts: Post[] = [];
  editingPostId: number | null = null;
  tempPost: Partial<Post> = {};
  currentUser: string | null = null;
  newComment: { [key: number]: { author: string; message: string } } = {};
  isLoading = true;
  selectedCategory: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = localStorage.getItem("username")!;
    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = params["category"] || null;
      this.loadData();
    });
  }

  async loadData() {
    try {
      const postsResponse = await this.postService.getPosts().toPromise();
      this.posts = ((postsResponse as Post[]) || []).map((post) => ({
        ...post,
        name: post.username,
      }));

      this.initializeDisplay();
    } catch (error) {
      console.error("Failed to load data", error);
      this.posts = [];
    } finally {
      this.isLoading = false;
    }
  }

  initializeDisplay() {
    this.posts.forEach((post) => {
      if (post.id && !this.newComment[post.id]) {
        this.newComment[post.id] = { author: "", message: "" };
      }
    });

    this.filterPostsByCategory();
  }

  isPostOwner(post: Post): boolean {
    return !!this.currentUser && post.username === this.currentUser;
  }

  startEditing(post: Post) {
    this.editingPostId = post.id || null;
    this.tempPost = { ...post };
  }

  async saveEdit() {
    if (!this.editingPostId || !this.tempPost) return;

    try {
      const updatedPost = await this.postService
        .updatePost(this.editingPostId, this.tempPost as Post)
        .toPromise();

      const index = this.posts.findIndex((p) => p.id === this.editingPostId);
      if (index !== -1) {
        this.posts[index] = updatedPost as Post;
        this.displayedPosts = [...this.posts];
      }
      this.editingPostId = null;
    } catch (error) {
      console.error("Failed to update post", error);
    }
  }

  cancelEdit() {
    this.editingPostId = null;
  }

  async deletePost(postId: number) {
    try {
      await this.postService.deletePost(postId).toPromise();

      this.posts = this.posts.filter((post) => post.id !== postId);
      this.displayedPosts = this.displayedPosts.filter(
        (post) => post.id !== postId
      );

      this.updatePagedPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }

  updatePagedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedPosts = this.displayedPosts.slice(startIndex, endIndex);

    this.pagedPosts.forEach((post) => {
      if (post.id && !this.newComment[post.id]) {
        this.newComment[post.id] = { author: "", message: "" };
      }
    });

    this.cdr.detectChanges();
  }

  searchPosts(searchTerm: string) {
    let filtered = this.selectedCategory
      ? this.posts.filter((post) => post.category === this.selectedCategory)
      : [...this.posts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.instrument.toLowerCase().includes(term) ||
          post.description.toLowerCase().includes(term) ||
          (post.name && post.name.toLowerCase().includes(term))
      );
    }
    this.displayedPosts = filtered;
    this.currentPage = 1;
    this.updatePagedPosts();
  }

  sortPosts(order: "new" | "old") {
    this.displayedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "new" ? dateB - dateA : dateA - dateB;
    });
    this.updatePagedPosts();
  }

  nextPage() {
    const totalPages = this.totalPages();
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePagedPosts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedPosts();
    }
  }

  totalPages(): number {
    return Math.ceil(this.displayedPosts.length / this.itemsPerPage);
  }

  updateCommentAuthor(postId: number, value: string) {
    if (!this.newComment[postId]) {
      this.newComment[postId] = { author: "", message: "" };
    }
    this.newComment[postId].author = value;
  }

  updateCommentMessage(postId: number, value: string) {
    if (!this.newComment[postId]) {
      this.newComment[postId] = { author: "", message: "" };
    }
    this.newComment[postId].message = value;
  }

  getPostsByCategory(category: string): Post[] {
    if (this.selectedCategory) {
      return this.displayedPosts.filter((post) => post.category === category);
    } else {
      return this.posts.filter((post) => post.category === category);
    }
  }

  getCategories(): string[] {
    if (this.selectedCategory) {
      return [this.selectedCategory];
    }
    return ["پوشاک مردانه", "کفش", "اکسسوری مردانه"];
  }

  filterPostsByCategory() {
    if (this.selectedCategory) {
      this.displayedPosts = this.posts.filter(
        (post) => post.category === this.selectedCategory
      );
    } else {
      this.displayedPosts = [...this.posts];
    }
    this.currentPage = 1;
    this.updatePagedPosts();
  }
}
