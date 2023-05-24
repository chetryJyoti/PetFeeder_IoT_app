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
  currentMarkerPosition: string = '5%';
  initialMarkerPosition = 0;
  markerPositions: string[] = [
    '5%',
    '10%',
    '15%',
    '20%',
    '25%',
    '30%',
    '35%',
    '40%',
    '45%',
    '50%',
    '55%',
    '60%',
    '65%',
    '70%',
    '75%',
    '80%',
    '85%',
    '90%',
    '95%',
  ];

  //means when the currentFeedCount reaches 19 the food is finished(this will be a hard coded value)
  emptyFoodCount = 19;

  foodEmptyMessage: string = '';
  emptyFoodColor: string = 'var(--ion-color-success)';
  options: any;
  selectedImage: string = '../../assets/images/bruno.jpeg';
  constructor(
    private http: HttpClient,
    private appwriteService: AppwriteService,
    private alertController: AlertController,
    private imagePicker: ImagePicker
  ) {

  }
  imagePkr() {
    this.options = {
      width: 60,
      height: 60,
      quality: 30,
      outputType: 1
    };

    this.imagePicker.getPictures(this.options).then((results) => {
      if (results.length > 0) {
        this.selectedImage = results[0];
        console.log('Image URI: ' + this.selectedImage);
      }
    }, (err) => { });
  }

  updateMarkerPosition() {
    this.emptyFoodCount -= 1;

    if (this.emptyFoodCount <= 0) {
      this.currentMarkerPosition =
        this.markerPositions[this.markerPositions.length - 1];
      this.foodEmptyMessage = 'Food is empty';
      this.emptyFoodColor = 'var(--ion-color-danger)';
    } else {
      this.initialMarkerPosition += 1;

      if (this.initialMarkerPosition >= this.markerPositions.length) {
        this.initialMarkerPosition = 0;
      }

      this.currentMarkerPosition =
        this.markerPositions[this.initialMarkerPosition];
      this.foodEmptyMessage = '';
    }

    console.log(this.emptyFoodCount);
    console.log(this.currentMarkerPosition);
    console.log(this.foodEmptyMessage);
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

  ngOnInit() {
    //for testing purposes iam stoping api calls
    // this.getFeedData();
    // this.getTotalFeedCounts();
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
          this.currentFeedCount = firstDocument.FeedTimes;
          console.log(
            'Feed count retrieved successfully:',
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

  async resetFeedCount() {
    this.currentFeedCount = 0;
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
    this.currentFeedCount += 1;
    this.totalFeedCount += 1;
    this.updateMarkerPosition();
    const data = {
      FeedTimes: this.currentFeedCount, // Pass the integer value directly
      totalFeedCount: this.totalFeedCount,
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

  ///total feed counts
  async getTotalFeedCounts() {
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
