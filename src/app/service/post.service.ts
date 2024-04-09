import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const BASE_URL = 'http://localhost:8081';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  createNewPost(data: any): Observable<any> {
    return this.http.post(BASE_URL + '/post', data);
  }

  getAllPosts(): Observable<any> {
    return this.http.get(BASE_URL + '/posts');
  }

  uploadPostImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', imageFile);
    return this.http.post(BASE_URL + '/images/db/upload', formData);
  }
}
