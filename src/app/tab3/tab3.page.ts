import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppwriteService } from 'src/app/services/appwriteService';
import { DatePipe } from '@angular/common';
//auth configs
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  providers: [DatePipe],
})
export class Tab3Page {
  images: { url: SafeUrl; createdAt: string; imageId: string }[] = [];
  isLoading: boolean = false;

  constructor(
    private appwriteService: AppwriteService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  async fetchImages() {
    this.isLoading = true;
    const bucketId = environment.BUCKET_ID;
    await this.appwriteService.getAllImages(bucketId).then(
      (response) => {
        // console.log(response);
        this.images = response.files
          .map((file: any) => ({
            url: this.getSafeUrl(file.$id),
            createdAt: file.$createdAt, // Assuming createdAt is present in the response
            imageId: file.$id,
          }))
          .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));

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

  async deleteThisImg(imageId: any) {
    await this.appwriteService.deleteImage(environment.BUCKET_ID, imageId);
    // console.log(imageId);
    setTimeout(() => {
      this.fetchImages();
    }, 2000);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
