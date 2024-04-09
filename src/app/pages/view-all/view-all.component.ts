import { Component, OnInit } from '@angular/core';
import { PostService } from "../../service/post.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss']
})
export class ViewAllComponent implements OnInit {
  allPosts: any[] = [];
  visiblePosts: any[] = [];
  currentPage: number = 0;
  pageSize: number = 3;

  constructor(private postService: PostService,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe(res => {
      console.log(res);
      this.allPosts = res;
      this.updateVisiblePosts();
    }, error => {
      this.snackBar.open("Failed to fetch posts", "OK");
    });
  }

  updateVisiblePosts() {
    const startIndex = this.currentPage * this.pageSize;
    this.visiblePosts = this.allPosts.slice(startIndex, startIndex + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateVisiblePosts();
    }
  }

  nextPage() {
    const lastPage = Math.ceil(this.allPosts.length / this.pageSize) - 1;
    if (this.currentPage < lastPage) {
      this.currentPage++;
      this.updateVisiblePosts();
    }
  }
}
