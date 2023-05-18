import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppwriteService } from 'src/services/appwriteService';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page {
  images: SafeUrl[] = [];
  isLoading: boolean = false;

  constructor(
    private appwriteService: AppwriteService,
    private sanitizer: DomSanitizer
  ) {}

  // ngOnInit() {
  //   this.isLoading=true;
  //   this.fetchImages();
  //   this.isLoading=false;
  // }
  async fetchImages() {
    this.isLoading = true;
    const bucketId = environment.BUCKET_ID;
    await this.appwriteService.getAllImages(bucketId).then(
      (response) => {
        console.log(response); // Success
        this.images = response.files.map((file: any) =>
          this.getSafeUrl(file.$id)
        );
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false; // Failure
      }
    );
  }
  getSafeUrl(fileId: string): SafeUrl {
    const unsafeUrl = `https://cloud.appwrite.io/v1/storage/buckets/${environment.BUCKET_ID}/files/${fileId}/view?project=${environment.PROJECT_ID}`;
    return this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);
  }
}
