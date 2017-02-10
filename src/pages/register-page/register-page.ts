import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { CountryService } from '../../providers/country-service';
import { EmailValidationService } from '../../providers/email-validation-service';

import { HomePage } from '../../pages/home/home';

/*
  Generated class for the RegisterPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register-page',
  templateUrl: 'register-page.html',
	providers: [AuthService, CountryService, EmailValidationService]
})
export class RegisterPage {
	loading: Loading;
	@ViewChild('signupSlider') signupSlider: any;

    slideOneForm: FormGroup;
    slideTwoForm: FormGroup;
		slideThreeForm: FormGroup;
		slideFourForm: FormGroup;
		countryList = [];
    imagesToUpload: Array<File>;

    submitAttempt: boolean = false;

    constructor(public formBuilder: FormBuilder, private navCtrl: NavController,  private loadingCtrl: LoadingController,
		private auth: AuthService, private country: CountryService, private emailVal: EmailValidationService, private alertCtrl: AlertController) {

			this.countryList = country.getCountryList();
      this.imagesToUpload = [];

			this.slideOneForm = formBuilder.group({
				firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
				password: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
				confirmPassword: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
				email: ['', Validators.compose([Validators.maxLength(60), Validators.required])],
				gender: ['', Validators.required],
				country: ['', Validators.required],
        dob: ['']
    	});
			this.slideTwoForm = formBuilder.group({
				firstSq: ['', Validators.compose([Validators.required])],
        firstAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        secondSq: ['', Validators.compose([Validators.required])],
        secondAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			  thirdSq: ['', Validators.compose([Validators.required])],
        thirdAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    	});
		}
    next(){
			this.signupSlider.slideNext();
    }

    prev(){
			this.signupSlider.slidePrev();
		}

    save(){

    }

    fileChangeEvent(fileInput: any){
      // console.log(this.images);
      this.imagesToUpload = <Array<File> > fileInput.target.files
      console.log(this.imagesToUpload);
    }



		onEmailChange(value){
			console.log(value);
			if(value !=  ""){
				this.emailVal.CheckEmail(value).subscribe(data => {
		      this.slideOneForm.controls['email'].setErrors(data);
		    },
		    error => {
		      this.showError(error);
		    });
			}
		}

	showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });

    alert.present(prompt);
  }

}
