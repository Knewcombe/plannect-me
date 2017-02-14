import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';
import { CountryService } from '../../providers/country-service';
import { EmailValidationService } from '../../providers/email-validation-service';
import { AgeValidator } from '../../providers/age_validation';
import { PassValidator } from '../../providers/pass_validation'

import { HomePage } from '../../pages/home/home';

/*
  Generated class for the RegisterPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

//NOTE: Will need to add https://github.com/chriso/validator.js to salt the string
@Component({
  selector: 'page-register-page',
  templateUrl: 'register-page.html',
	providers: [AuthService, CountryService, EmailValidationService]
})


export class RegisterPage {
	loading: Loading;
	@ViewChild('signupSlider') signupSlider: any;
	@ViewChild("input") nativeInputBtn: any;

    slideOneForm: FormGroup;
    slideTwoForm: FormGroup;
		slideThreeForm: FormGroup;
		countryList = [];
    imgSrc = [];
		imgIndex = 0;
		currentIndex = 0;

    submitAttempt: boolean = false;

    constructor(private renderer: Renderer, public formBuilder: FormBuilder, private navCtrl: NavController,  private loadingCtrl: LoadingController,
		private auth: AuthService, private country: CountryService, private emailVal: EmailValidationService, private alertCtrl: AlertController) {

			this.countryList = country.getCountryList();

			for(var i = 0; i < 5; ++i){
				this.imgSrc.push('');
			}
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
    next(){
			this.signupSlider.slideNext();
    }

    prev(){
			this.signupSlider.slidePrev();
		}

		slideChanged() {
      console.log(this.slideThreeForm);
			this.currentIndex = this.signupSlider.getActiveIndex();
      if(this.slideOneForm.get("dob").valid){
        this.slideOneForm.controls['dob'].disable();
        let ageVal = this.slideOneForm.get('dob');
        if(ageVal['warnings'].toYoung){
          this.slideThreeForm.controls['visiableRate'].disable();
          this.slideThreeForm.controls['hidden'].disable();
          this.slideThreeForm.controls['visiableRate'].setValue(0);
          this.slideThreeForm.controls['hidden'].setValue(0);
        }
      }
  	}

    save(){
      this.submitAttempt = true;

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
            this.auth.login(loginCredentials).subscribe(data =>{
              if(data == true){
                this.auth.setQuestions(this.auth.User.user_id, this.slideTwoForm).subscribe(data => {
                  if(data == true){
                    // this.loading.dismiss();
                  }else{
                    this.showError("Access Denied");
                  }
                })
                // this.nav.setRoot(HomePage)
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
        this.imgSrc[this.imgIndex] = reader.result;
				console.log(this.imgSrc)
    }

		removeImage(index){
			this.imgSrc[index] = '';
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

  showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

}
