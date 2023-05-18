import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { AppwriteService } from 'src/services/appwriteService';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  servoState: string = 'off';
  disableButton: boolean = false;
  THINGS_UPDATE_URI = 'https://api.thingspeak.com/update.json';
  feedCount = 0;
  // private appwriteService:AppwriteService
  constructor(private http: HttpClient,) {}

  resetFeedCount() {
    this.feedCount = 0;
  }

  updateFeedCount(){
    this.feedCount += 1;
    // this.appwriteService.updateCounter(this.feedCount);
  }

  async toggleServo() {
    this.updateFeedCount()
    this.servoState = this.servoState === 'on' ? 'off' : 'on';
    const data = {
      api_key: environment.THINGS_WRITE_API_KEY,
      field1: this.servoState === 'on' ? '1' : '0',
    };

    await this.http.post(this.THINGS_UPDATE_URI, data).subscribe(() => {
      console.log(`Servo toggled ${this.servoState}`);
      this.disableButton = true;

      // Automatically turn off the toggle button after 15 seconds
      setTimeout(() => {
        this.servoState = 'off';
        const offData = {
          api_key: environment.THINGS_WRITE_API_KEY,
          field1: '0',
        };
        this.http.post(this.THINGS_UPDATE_URI, offData).subscribe(() => {
          console.log('Servo turned off automatically');
          this.disableButton = false;
        });
      }, 15000);
    });
  }
}
