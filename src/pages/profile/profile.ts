import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserInfo, ProfileInfo } from '../../providers/auth-service';
import { ImageService } from '../../providers/image-service';
import { CountryService } from '../../providers/country-service';
import { EmailValidationService } from '../../providers/email-validation-service';
import { AgeValidator } from '../../providers/age_validation';
import { PassValidator } from '../../providers/pass_validation'

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
	providers:[ ImageService, EmailValidationService, AgeValidator, PassValidator]
})
export class ProfilePage {

	userInfo: UserInfo;
	profileInfo: ProfileInfo;
	userForm: FormGroup;
	UserOptionsForm: FormGroup;
	passwordForm: FormGroup;
	countryList = [];
	imgSrc = [];
	imgIndex = 0;
	currentIndex = 0;
	imgUpload = [];
	submitAttempt: boolean = false;

  constructor(private renderer: Renderer, public formBuilder: FormBuilder, private navCtrl: NavController,  private loadingCtrl: LoadingController,
	private auth: AuthService, private image: ImageService, private country: CountryService, private emailVal: EmailValidationService, private alertCtrl: AlertController) {

		this.countryList = country.getCountryList();

		for(var i = 0; i < 5; ++i){
			this.imgSrc.push('');
		}
		this.userInfo = this.auth.getUserInfo();
		this.profileInfo = this.auth.getProfile();

		this.userForm = formBuilder.group({
			firstName: [this.userInfo.first_name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			lastName: [this.userInfo.last_name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			email: [this.userInfo.user_email, Validators.compose([Validators.maxLength(60), Validators.required])],
			gender: [this.profileInfo.gender, Validators.compose([Validators.required])],
			country: [this.profileInfo.country, Validators.compose([Validators.required])],
			dob: [this.userInfo.date_of_birth, Validators.compose([Validators.required, AgeValidator.isOlder])]
		});

		this.UserOptionsForm = formBuilder.group({
			rating: [this.profileInfo.allow_rating],
			visiableRate: [this.profileInfo.visable_rating],
			hidden: [this.profileInfo.hidden],
		})

		this.passwordForm = formBuilder.group({
			oldPassword: ['', Validators.compose([Validators.required])],
			newPasswords: formBuilder.group({
				firstPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
				secondPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
			}, {validator: PassValidator.areEqual})
		})

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }


}
