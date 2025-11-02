import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "./environment";
import { Observable, of } from "rxjs";
import { Post } from "./model/post.model";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  logout(): Observable<any> {
    this.clearAuthData();
    this.router.navigate(["/login"]);
    return of(null);
  }

  private clearAuthData() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("current_user");
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}
