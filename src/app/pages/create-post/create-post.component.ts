import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PostService } from "../../service/post.service";



@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm!: FormGroup;
  posts: any[] = [];
  displayedColumns: string[] = ['postNumber', 'postTitle', 'button'];
  imageForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private postService: PostService) {
    this.imageForm = this.fb.group({
      image: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.postForm = this.fb.group({
      name: [null, Validators.required],
      content: [null, Validators.maxLength(5000)],
      image: [null, Validators.required],
      postedBy: [null, Validators.required]
    });

    this.getAllPosts();
  }

  createPost() {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      this.postService.createNewPost(postData).subscribe(
        res => {
          this.snackBar.open("Post created successfully", "OK");
          this.router.navigateByUrl("/view-all");
        },
        error => {
          this.snackBar.open("Failed to create post", "OK");
        }
      );
    } else {
      this.snackBar.open("Please fill out the form correctly", "OK");
    }
  }

  private getAllPosts() {
    this.postService.getAllPosts().subscribe(
      res => {
        this.posts = res || [];
      },
      error => {
        this.snackBar.open("Failed to fetch posts", "OK");
      }
    );
  }

  uploadImage(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    this.imageForm.patchValue({
      image: file
    });
    this.imageForm.get('image')!.updateValueAndValidity();
  }

  postImage() {
    if (this.imageForm.valid) {
      const file = this.imageForm.value.image;
      this.postService.uploadPostImage(file).subscribe(
        (res: any) => {
          this.snackBar.open('Image uploaded successfully', 'OK');
          // Ustawienie linku do zdjęcia w polu formularza
          this.postForm.get('image')!.setValue(res.link);
        },
        error => {
          this.snackBar.open('Failed to upload image', 'OK');
        }
      );
    } else {
      this.snackBar.open('Please upload an image', 'OK');
    }
  }
  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe(() => {
      // Aktualizuj listę postów po usunięciu
      this.getAllPosts();
    });
  }
}
