import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppwriteService } from 'src/app/services/appwriteService';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  selectedDate: string = '';
  showPicker: boolean = false;
  constructor(private alertController:AlertController,private appwriteService: AppwriteService) {
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    this.selectedDate = currentDate.toLocaleString('en-IN', options);
    // console.log(this.selectedDate);
  }

  async presentAlertForSchedulingFeed() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Your pet will be next feed automatically in this time',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: () => {
            this.updateDateTime();
          },
        },
      ],
    });
    await alert.present();
  }

  toggleDateTimePicker() {
    this.showPicker = !this.showPicker;
  }
  updateDateTime() {
    const data = {
      selectedDateTime: this.selectedDate,
    };



  }
}
