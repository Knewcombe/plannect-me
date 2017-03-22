import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, ViewController, Content } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { ImageService, Images } from '../../providers/image-service';
import { CountryService } from '../../providers/country-service';
import { EmailValidationService } from '../../providers/email-validation-service';
import { AgeValidator } from '../../providers/age_validation';
import { PassValidator } from '../../providers/pass_validation'
import { CropingImagePage } from '../../pages/croping-image/croping-image';

import { HomePage } from '../../pages/home/home';
import { DashboardPage } from '../../pages/dashboard/dashboard';

import { User } from '../../providers/user'

/*
  Generated class for the RegisterPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

//NOTE: Will need to add https://github.com/chriso/validator.js to salt the string

@Component({
  selector: 'page-register-page',
  templateUrl: 'register-page.html',
	providers:[AuthService, EmailValidationService, PassValidator, AgeValidator, ImageService]
})

export class RegisterPage {
	loading: Loading;
	@ViewChild('signupSlider') signupSlider: any;
	@ViewChild("input") nativeInputBtn: any;
	@ViewChild(Content) content: Content;
    slideOneForm: FormGroup;
    slideTwoForm: FormGroup;
		slideThreeForm: FormGroup;
		countryList = [];
    public imgSrc = [];
		public imgIndex = 0;
		currentIndex = 0;
		imgUpload = [];
		_handleReaderLoaded;


    submitAttempt: boolean = false;

    constructor(private renderer: Renderer, public formBuilder: FormBuilder, private navCtrl: NavController,  private loadingCtrl: LoadingController, private viewCtrl: ViewController,
		private auth: AuthService, private image: ImageService, private country: CountryService, private emailVal: EmailValidationService, private alertCtrl: AlertController, private user: User) {
			this.viewCtrl.setBackButtonText('Cancel');
			this.countryList = country.getCountryList();

			for(var i = 0; i < 5; ++i){
				this.imgSrc.push('');
			}

			var self = this;

			this._handleReaderLoaded = (function(data) { // parenthesis are not necessary
				return new Promise((resolve, reject) => {
					self.imgSrc[self.imgIndex] = data;
          self.nativeInputBtn.nativeElement.value = '';
	     		resolve();
				});
    	})

      //Change password pattern to this ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$
			this.slideOneForm = formBuilder.group({
				firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        passwords: formBuilder.group({
          firstPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
          secondPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
        }, {validator: PassValidator.areEqual}),
				email: ['', Validators.compose([Validators.maxLength(60), Validators.required])],
				gender: ['', Validators.compose([Validators.required])],
				country: ['', Validators.compose([Validators.required])],
        dob: ['', Validators.compose([Validators.required, AgeValidator.isOlder])]
    	});
			this.slideTwoForm = formBuilder.group({
				firstSq: ['', Validators.compose([Validators.required])],
        firstAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        secondSq: ['', Validators.compose([Validators.required])],
        secondAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			  thirdSq: ['', Validators.compose([Validators.required])],
        thirdAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
    	});
			this.slideThreeForm = formBuilder.group({
				rating: [1],
				visiableRate: [1],
				hidden: [1],
			});
		}
		ionViewDidLoad() {
			this.signupSlider.lockSwipes();
		}

    next(){
			this.signupSlider.slideNext();
    }

    prev(){
			this.signupSlider.slidePrev();
		}
		test(){
			console.log(this.slideOneForm.controls['dob'].value);
			if(this.slideOneForm.controls['dob'].value){
				// this.slideOneForm.controls['dob'].valid = false;
				// this.slideOneForm.valid = true;
				console.log(this.slideOneForm.controls['dob'].invalid);
				console.log(this.slideOneForm.controls['dob'].valid);
			}
		}
		slideChanged() {
			this.content.scrollToTop();
			this.currentIndex = this.signupSlider.getActiveIndex();

      // if(this.slideOneForm.get("dob").valid){
      //   this.slideOneForm.controls['dob'].disable();
      //   // let ageVal = this.slideOneForm.get('dob');
      //   // if(ageVal['warnings'].toYoung){
      //   //   this.slideThreeForm.controls['visiableRate'].disable();
      //   //   this.slideThreeForm.controls['hidden'].disable();
      //   //   this.slideThreeForm.controls['visiableRate'].setValue(0);
      //   //   this.slideThreeForm.controls['hidden'].setValue(0);
      //   // }
      // }
  	}

    save(){
      this.submitAttempt = true;
			console.log(this.slideOneForm.controls['dob'].invalid);
			console.log(this.slideOneForm.controls['dob'].valid);

      if(!this.slideOneForm.valid){
          this.signupSlider.slideTo(0);
      }
      else if(!this.slideTwoForm.valid){
          this.signupSlider.slideTo(1);
      }
      else if(!this.slideThreeForm.valid){
          this.signupSlider.slideTo(2);
      }else{
        this.showLoading();
        this.auth.saveUser(this.slideOneForm, this.slideThreeForm).subscribe(data => {
          if (data == true) {
            let loginCredentials = {
              email: this.slideOneForm.controls['email'].value,
              password: this.slideOneForm.controls['passwords'].get('firstPass').value
            };
            this.auth.login(loginCredentials, false).subscribe(data =>{
              if(data == true){
                this.auth.setQuestions(this.user.getUserId(), this.slideTwoForm).subscribe(data => {
                  if(data == true){
										for(let image of this.imgSrc) {
  										if(image != ''){
												this.imgUpload.push(image);
											}
										}
                    if(this.imgUpload.length != 0){
										this.image.uploadImages(this.user.getToken(), this.user.getProfileId(), this.imgUpload).subscribe(data => {
											if(data == true){
												this.image.downloadImages(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
													if(data != false){
														if(data.length != 0){
															for (let image of data) {
																	this.user.setImage(new Images(image.pictureId, 'data:image/JPEG;base64,'+image.image, false));
															}
														}
													}
													this.loading.dismiss();
													this.navCtrl.setRoot(DashboardPage);
												})
											}
										})
                  }else{
                    this.loading.dismiss();
                    this.navCtrl.setRoot(DashboardPage);
                  }
                  }else{
                    this.showError("Access Denied");
                  }
                })
              }else{
        				this.showError("Access Denied");
        			}
            })
          }
        },
        error => {
          this.showError(error);
        });
      }
    }

		addImage(index){
      let alert = this.alertCtrl.create({
        title: 'New Picture',
        buttons: [
          {
            text: 'Take Picture',
            handler: () => {
              Camera.getPicture({
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: true,
                correctOrientation:true
              }).then((imageData) => {
               this.imgSrc[index] = 'data:image/jpeg;base64,' + imageData
              }, (err) => {
               console.log(err);
              });
            }
          },
          {
            text: 'Gallery',
            handler: () => {
              Camera.getPicture({
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: true,
                correctOrientation:true
              }).then((imageData) => {
               this.imgSrc[index] = 'data:image/jpeg;base64,' + imageData
              }, (err) => {
               console.log(err);
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      alert.present();
		}

		removeImage(index){
			this.imgSrc[index] = '';
		}

		onEmailChange(value){
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

  showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

}
