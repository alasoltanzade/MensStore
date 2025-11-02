import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
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

  // Post methods
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }

  likePost(postId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/like`,
      { username }, // Make sure to send an object
      { headers: this.getAuthHeaders() } // Add auth headers if needed
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("token"); // Get your auth token
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  unlikePost(postId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/unlike`,
      { username },
      { headers: this.getAuthHeaders() }
    );
  }

  // Follow methods
  getFollowing(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/stats/${username}`);
  }

  followUser(follower: string, following: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/follow`, { follower, following });
  }

  unfollowUser(follower: string, following: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/follow/${follower}/${following}`);
  }

  getFollowerCount(username: string): Observable<number> {
    return this.http
      .get<any>(`${this.apiUrl}/stats/${username}`)
      .pipe(map((response) => response.followers));
  }
}
