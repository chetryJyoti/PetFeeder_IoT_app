import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppwriteService } from 'src/services/appwriteService';
import { AlertController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  servoState: string = 'off';
  disableButton: boolean = false;
  currentFeedCount = 0;
  totalFeedCount = 0;
  lastFeedDateTime: string = '';

  //means when the currentFeedCount reaches 19 the food is finished(this will be a hard coded value)
  FOOD_EMPTY_ON = 19;

  foodLevelValue = 0;
  foodEmptyMessage: string = '';

  options: any;
  selectedImage: string = '../../assets/images/bruno.jpeg';
  constructor(
    private http: HttpClient,
    private appwriteService: AppwriteService,
    private alertController: AlertController,
    private imagePicker: ImagePicker
  ) {
    //fun to change pick images
  }
  imagePkr() {
    this.options = {
      width: 60,
      height: 60,
      quality: 30,
      outputType: 1,
    };

    this.imagePicker.getPictures(this.options).then(
      (results) => {
        if (results.length > 0) {
          this.selectedImage = results[0];
          console.log('Image URI: ' + this.selectedImage);
        }
      },
      (err) => {}
    );
  }

  async presentAlertForResetFeedCounts() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Refilling food!',
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

  getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    });
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    this.lastFeedDateTime = `${date} at ${time}`;
  }

  foodLevelStatus() {
    if (this.foodLevelValue >= 5 && this.foodLevelValue <= 10) {
      this.foodEmptyMessage = 'Okay';
      console.log(this.foodEmptyMessage);
      console.log(this.foodLevelValue);
    } else if (this.foodLevelValue > 10 && this.foodLevelValue <= 15) {
      this.foodEmptyMessage = 'Mid way ';
      console.log(this.foodLevelValue);
      console.log(this.foodEmptyMessage);
    } else if (this.foodLevelValue > 15 && this.foodLevelValue <= 19) {
      this.foodEmptyMessage = 'almost finished critical';
      console.log(this.foodLevelValue);
      console.log(this.foodEmptyMessage);
    } else if (this.foodLevelValue == 20) {
      this.foodEmptyMessage = 'empty';
      console.log(this.foodEmptyMessage);
      console.log(this.foodLevelValue);
    }
  }

  ngOnInit() {
    //for testing purposes iam stoping api calls
    this.getFeedDetails();
  }

  async resetFeedCount() {
    this.currentFeedCount = 0;
    const data = {
      FeedTimes: 0,
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

  async updateFeedDetails() {
    this.foodLevelValue = this.FOOD_EMPTY_ON - this.currentFeedCount;
    this.foodLevelStatus();
    this.currentFeedCount += 1;
    this.totalFeedCount += 1;
    this.getCurrentDateTime();
    const data = {
      FeedTimes: this.currentFeedCount, // Pass the integer value directly
      totalFeedCount: this.totalFeedCount,
      LastFeedDateTime: this.lastFeedDateTime,
      foodLevel:this.foodLevelValue
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

  //on off raspberry pi connected servo motor
  async toggleServo() {
    this.updateFeedDetails();
    this.servoState = this.servoState === 'on' ? 'off' : 'on';
    const data = {
      api_key: environment.THINGS_WRITE_API_KEY,
      field1: this.servoState === 'on' ? '1' : '0',
    };

    //talking to thingspeak
    await this.http.post(environment.THINGS_UPDATE_URI, data).subscribe(() => {
      console.log(`Servo toggled ${this.servoState}`);
      this.disableButton = true;

      // Automatically turn off the toggle button after 15 seconds
      setTimeout(() => {
        this.servoState = 'off';
        const offData = {
          api_key: environment.THINGS_WRITE_API_KEY,
          field1: '0',
        };
        this.http.post(environment.THINGS_UPDATE_URI, offData).subscribe(() => {
          console.log('Servo turned off automatically');
          this.disableButton = false;
        });
      }, 15000);
    });
  }

  async getFeedDetails() {
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
          this.totalFeedCount = firstDocument.totalFeedCount;
          this.currentFeedCount = firstDocument.FeedTimes;
          this.lastFeedDateTime = firstDocument.LastFeedDateTime;
          this.foodLevelValue=firstDocument.foodLevel
          console.log(
            'Total Feed count retrieved successfully:',
            this.currentFeedCount
          );
        } else {
          console.log('No documents found in the collection');
        }
      })
      .catch((error) => {
        console.log('Error retrieving feed count:', error);
      });
  }
}
