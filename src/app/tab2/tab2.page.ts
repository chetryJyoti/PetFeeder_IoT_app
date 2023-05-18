import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  imageUrl: SafeUrl = '';
  file_id: any;
  isLoading: boolean = false;
  image_notFound: boolean = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  async clickImageCall() {
    console.log('clickImageCalled');

    const onData = {
      api_key: environment.THINGS_WRITE_API_KEY,
      field2: '1',
    };

    const offData = {
      api_key: environment.THINGS_WRITE_API_KEY,
      field2: '0',
    };

    try {
      await this.http.post(environment.THINGS_UPDATE_URI, onData).toPromise();
      console.log('click data send');

      setTimeout(async () => {
        // Automatically turn off the toggle button after 15 seconds
        await this.http
          .post(environment.THINGS_UPDATE_URI, offData)
          .toPromise();
        console.log('OffData send automatically');
      }, 15000);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async fetchImageUrl(): Promise<void> {
    this.isLoading = true;
    await this.clickImageCall();
    setTimeout(async () => {
      console.log('img show called');
      try {
        const response = await this.http
          .get<any>(
            `${environment.THINGS_LINK}/${environment.THINGS_CHANNEL_ID}/fields/3.json?api_key=${environment.THINGS_READ_API_KEY}&results=10`
          )
          .toPromise();
        const feedData = response.feeds;
        console.log('feedData:', feedData);
        if (feedData && feedData.length > 0) {
          const latestFeed = feedData[0];
          console.log('latestFeed', latestFeed);
          this.file_id = latestFeed.field3;
          if (latestFeed.field3 == null) {
            this.image_notFound = true;
          }
          const unsafeUrl = `${environment.ENDPOINT}/storage/buckets/${environment.BUCKET_ID}/files/${this.file_id}/view?project=${environment.PROJECT_ID}`;
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(unsafeUrl);
        } else {
          console.log('No feed data found.');
        }
        this.isLoading = false;
      } catch (error) {
        console.log('Failed to fetch feed data:', error);
      }
      //make this 30s senconds in production
    }, 30000);
  }

  
}
