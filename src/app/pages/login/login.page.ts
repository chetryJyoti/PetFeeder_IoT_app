import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppwriteService } from 'src/app/services/appwriteService';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private appwriteService: AppwriteService
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.authService.login(this.credentials.value);
      // console.log(await this.appwriteService.getCurrentLogInUser());
      await loading.dismiss();
      this.authService.isAuthenticated.next(true);
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Login failed',
        message: 'error',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
  async goToSignup() {
    this.router.navigateByUrl('/signup', { replaceUrl: true });
  }
}
