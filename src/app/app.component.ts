import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Keyboard } from 'ionic-native';
import { HomePage } from '../pages/home/home';

import { AuthService } from '../providers/auth-service';
import { CountryService } from '../providers/country-service';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
