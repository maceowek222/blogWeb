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
  visiblePosts = this.allPosts;
  currentPage: number = 0;
  pageSize: number = 3;
  value: string = '';
  expandedPostId: number | null = null;


  constructor(private postService: PostService,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getAllPosts();
  }
  expandPost(postId: number): void {
    this.expandedPostId = postId;
  }

  collapsePost(): void {
    this.expandedPostId = null;
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe(
      res => {
        console.log(res);
        res.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
        this.allPosts = res;
        this.updateVisiblePosts();
      },
      error => {
        this.snackBar.open("Failed to fetch posts", "OK");
      }
    );
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

  searchPosts(searchText: string) {
    if (searchText) {
      this.visiblePosts = this.allPosts.filter(post =>
        post.name.toLowerCase().includes(searchText.toLowerCase()) ||
        post.content.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.visiblePosts = this.allPosts;
    }
  }
}
