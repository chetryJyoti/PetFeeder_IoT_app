import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppwriteService } from 'src/app/services/appwriteService';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppwriteException } from 'appwrite';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  registrationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private appwriteService: AppwriteService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}
  async signup() {
    if (this.registrationForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Signing up...',
      });
      await loading.present();

      const name = this.registrationForm.value.name;
      const email = this.registrationForm.value.email;
      const password = this.registrationForm.value.password;

      try {
        await this.appwriteService.signup(email, password, name);
        await loading.dismiss();
        // Redirect to the desired page after successful signup
        this.goToLogin();
      } catch (error) {
        await loading.dismiss();
        console.log('error', error);
        let errorMessage: any = error;
        const alert = await this.alertController.create({
          header: 'Signup Error',
          message: errorMessage,
          buttons: ['OK'],
        });

        await alert.present();
      }
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
