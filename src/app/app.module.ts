import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register-page/register-page';
import { AboutPage } from '../pages/about/about';

//Services
import { AuthService } from '../providers/auth-service';
// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// Initialize Firebase
// AF2 Settings
export const firebaseConfig = {
    apiKey: "AIzaSyC5wOEWl8tubdCVUozaJBLmockoeb-oboo",
    authDomain: "test-plannectme.firebaseapp.com",
    databaseURL: "https://test-plannectme.firebaseio.com",
    storageBucket: "test-plannectme.appspot.com",
    messagingSenderId: "831532457591"
  };
  // firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
		RegisterPage,
		AboutPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
        platforms : {
          ios : {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
          }
          // http://ionicframework.com/docs/v2/api/config/Config/)
        }
      }),
		AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
		MyApp,
		HomePage,
		RegisterPage,
		AboutPage
  ],
  providers: [AuthService]
})
export class AppModule {}
