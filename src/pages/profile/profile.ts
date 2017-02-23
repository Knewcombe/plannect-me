import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { ImageService, Images } from '../../providers/image-service';
import { CountryService } from '../../providers/country-service';
import { EmailValidationService } from '../../providers/email-validation-service';
import { AgeValidator } from '../../providers/age_validation';
import { PassValidator } from '../../providers/pass_validation'

import { User, UserInfo, ProfileInfo, TokenInfo } from '../../providers/user'

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
	providers:[AuthService, EmailValidationService, PassValidator, AgeValidator, ImageService]
})
export class ProfilePage {

  @ViewChild("input") nativeInputBtn: any;

	userInfo: UserInfo;
	profileInfo: ProfileInfo;
	userForm: FormGroup;
	UserOptionsForm: FormGroup;
	passwordForm: FormGroup;
  loading: Loading;
	countryList = [];
	imgSrc = [];
	imgIndex = 0;
	currentIndex = 0;
	imgUpload = [];
	imgRemove = [];

  userChanged: boolean = false;
  passwordChanged: boolean = false;

	submitUserAttempt: boolean = false;
	submitPassAttempt: boolean = false;

  constructor(private renderer: Renderer, public formBuilder: FormBuilder, private navCtrl: NavController,  private loadingCtrl: LoadingController,
	private auth: AuthService, private image: ImageService, private country: CountryService, private emailVal: EmailValidationService, private alertCtrl: AlertController, private user: User, private imageSer: ImageService) {

		this.countryList = country.getCountryList();

		this.userInfo = this.user.getUserInfo();
		this.profileInfo = this.user.getProfile();
    this.imgSrc = this.user.getImages();

    for(var i = 0; i < 5; ++i){
      if(!this.imgSrc[i]){
        this.imgSrc.push(new Images(null, '', false));
      }
		}

		this.userForm = formBuilder.group({
			firstName: [this.userInfo.first_name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			lastName: [this.userInfo.last_name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      gender: [this.profileInfo.gender, Validators.compose([Validators.required])],
			email: [this.userInfo.user_email, Validators.compose([Validators.maxLength(60), Validators.required])],
			country: [this.profileInfo.country, Validators.compose([Validators.required])],
      rating: [this.profileInfo.allow_rating],
			visiableRate: [this.profileInfo.visable_rating],
			hidden: [this.profileInfo.hidden]
		})

		this.passwordForm = formBuilder.group({
			oldPassword: ['', Validators.compose([Validators.required])],
			newPasswords: formBuilder.group({
				firstPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
				secondPass: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
			}, {validator: PassValidator.areEqual})
		})

    this.userForm.valueChanges.subscribe(data => {
      this.userChanged = true;
    });

    this.passwordForm.valueChanges.subscribe(data => {
      this.passwordChanged = true;
    });

	}

  saveUser(){
    this.submitUserAttempt = true;
    if(this.userChanged && this.userForm.valid){
      this.showLoading();
        this.auth.updateUserInfo(this.user.getToken(), this.user.getUserId(), this.user.getProfileId(), this.userForm).subscribe(data =>{
          if(data != false){
            this.showMessage('Success','Information has been updated');
						if(window.localStorage.getItem('user')){
							window.localStorage.removeItem('user');
							window.localStorage.setItem('user', JSON.stringify({
								user: {
									userInfo: this.user.getUserInfo(),
									profileInfo: this.user.getProfile(),
								}
							}))
						}else{
							window.sessionStorage.removeItem('user');
							window.sessionStorage.setItem('user', JSON.stringify({
								user: {
									userInfo: this.user.getUserInfo(),
									profileInfo: this.user.getProfile()
								}
							}))
						}
          }
        },
      error =>{
        this.showError(error);
      })
    }
  }

  savePassword(){
    if(this.passwordChanged && this.passwordForm.valid){
			if(this.passwordForm.controls['oldPassword'].value != this.passwordForm.controls['newPasswords'].get('firstPass').value){
					this.showLoading();
					this.auth.changePassword(this.passwordForm, this.user.getUserId(), this.user.getToken()).subscribe(data =>{
						this.passwordForm.reset();
						if(!data.auth){
	            this.showMessage('Success','Password has been updated');
	          }else{
							this.showError('Old password does not match, please try again');
						}
	        },
	      error =>{
	        this.showError(error);
	      });
			}else{
				this.showError('Please use a different password when changing');
			}
    }else{
			this.showError('Please enter a valid password');
		}
  }

  saveImage(){
		for (let image of this.imgSrc) {
			if(image.changed){
				this.imgUpload.push({image: image.imageBase64, pictureId: image.picture_id});
			}
		}

		if(this.imgUpload.length > 0){
			this.showLoading();
			console.log("Update Images");
			this.imageSer.updateImages(this.user.getToken(), this.user.getProfileId(), this.imgUpload).subscribe(data =>{
				console.log(data);
				if(data != false){
					console.log("Image uploaded");
					this.imgUpload = [];
					this._imageChangeComplete();
				}
			});
		}
  }

	_imageChangeComplete(){
		this.user.resetImages();
		this.imageSer.downloadImages(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
			console.log(data);
			if(data != false){
				if(data.length != 0){
					for(let image of data){
						this.user.setImage(new Images(image.pictureId, 'data:image/JPEG;base64,'+image.image, false))
					}
					this.imgSrc = this.user.getImages();
					for(var i = 0; i < 5; ++i){
			      if(!this.imgSrc[i]){
			        this.imgSrc.push(new Images(null, '', false));
			      }
					}
				}
				this.showMessage('Success', 'Images have been updated');
			}
		});
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  addImage(index){
    console.log(index)
    this.imgIndex = index;
    let clickEvent: MouseEvent = new MouseEvent("click", {bubbles: true});
    console.log(this.nativeInputBtn)
    this.renderer.invokeElementMethod(
      this.nativeInputBtn.nativeElement, "dispatchEvent", [clickEvent]
    );
  }

  fileChangeEvent(e){
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
    }

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
      var reader = e.target;
      this.imgSrc[this.imgIndex].imageBase64 = reader.result;
			this.imgSrc[this.imgIndex].changed = true;
  }

  removeImage(index){
		this.showLoading();
		this.imgRemove.push({pictureId: this.imgSrc[index].picture_id});
		this.imageSer.removeImages(this.user.getToken(), this.user.getProfileId(), this.imgRemove).subscribe(data =>{
			console.log(data);
			if(data != false){
				this.loading.dismiss();
				this.imgRemove = [];
				this.imgSrc[index].picture_id = null;
				this.imgSrc[index].imageBase64 = '';
				this.imgSrc[index].changed = false;
			}
		});
  }

  onEmailChange(value){
    if(value !=  "" && this.userForm.controls['email'].value != this.userInfo.user_email){
      this.emailVal.CheckEmail(value).subscribe(data => {
        this.userForm.controls['email'].setErrors(data);
      },
      error => {
        this.showError(error);
      });
    }
  }

showError(text) {
  this.loading.dismiss();
  let alert = this.alertCtrl.create({
    title: 'Fail',
    subTitle: text,
    buttons: ['OK']
  });

  alert.present(prompt);
}

showMessage(title, text){

	this.loading.dismiss();
  let alert = this.alertCtrl.create({
    title: title,
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
