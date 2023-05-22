import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppwriteService } from 'src/services/appwriteService';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  servoState: string = 'off';
  disableButton: boolean = false;
  THINGS_UPDATE_URI = 'https://api.thingspeak.com/update.json';
  feedCount = 0;
  // private appwriteService:AppwriteService
  constructor(
    private http: HttpClient,
    private appwriteService: AppwriteService,
    private alertController: AlertController
  ) {}

  async presentAlertForResetFeedCounts() {
    const alert = await this.alertController.create({
      header: 'Reset FeedCount',
      message: 'you are resetting feed counts this cannot be undone!',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: () => {
            this.resetFeedCount();
          },
        },
      ],
    });
    await alert.present();
  }

  ngOnInit() {
    this.getFeedData();
  }
  async getFeedData() {
    await this.appwriteService
      .listDocuments(
        environment.APPWRITE_DB_ID,
        environment.APPWRITE_COLLECTION_ID
      )
      .then((response) => {
        const documents = response.documents;
        console.log('documents:', documents);
        if (documents.length > 0) {
          const firstDocument = documents[0];
          this.feedCount = firstDocument.FeedTimes;
          console.log('Feed count retrieved successfully:', this.feedCount);
        } else {
          console.log('No documents found in the collection');
        }
      })
      .catch((error) => {
        console.log('Error retrieving feed count:', error);
      });
  }

  async resetFeedCount() {
    this.feedCount = 0;
    const data = {
      FeedTimes: 0, // Pass the integer value directly
    };
    await this.appwriteService
      .updateDocument(
        environment.APPWRITE_DB_ID,
        environment.APPWRITE_COLLECTION_ID,
        environment.APPWRITE_DOC_ID,
        data
      )
      .then(() => {
        console.log('Counter reset successfully');
      })
      .catch((error) => {
        console.log('Error reseting feedCounts:', error);
      });
  }

  async updateFeedCount() {
    this.feedCount += 1;
    const data = {
      FeedTimes: this.feedCount, // Pass the integer value directly
    };
    await this.appwriteService
      .updateDocument(
        environment.APPWRITE_DB_ID,
        environment.APPWRITE_COLLECTION_ID,
        environment.APPWRITE_DOC_ID,
        data
      )
      .then(() => {
        console.log('Counter updated successfully');
      })
      .catch((error) => {
        console.log('Error updating feedCounts:', error);
      });
  }

  async toggleServo() {
    this.updateFeedCount();
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
