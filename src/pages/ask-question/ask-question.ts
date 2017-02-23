import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../providers/auth-service';

import { ChangePassPage } from '../../pages/change-pass/change-pass';

/*
  Generated class for the AskQuestion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ask-question',
  templateUrl: 'ask-question.html',
	providers: [AuthService]
})
export class AskQuestionPage {
	questions = [];
	loading: Loading;
	answerForm: FormGroup;
	submitAttempt = false;

  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private auth: AuthService, public formBuilder: FormBuilder) {
		this.questions = navParams.get('questions');
		console.log(this.questions);

		this.answerForm = formBuilder.group({
			firstAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			secondAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			thirdAns: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
		});

	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AskQuestionPage');
  }

	submitAnswer(){
		this.showLoading();
		this.submitAttempt = false;
		var answer = '';
		var questionArray = [];
		this.questions.forEach((item, index) =>{
		switch(index) {
		   case 0: {
		      answer = this.answerForm.controls['firstAns'].value
		      break;
		   }
		   case 1: {
		      answer = this.answerForm.controls['secondAns'].value
		      break;
		   }
			 case 2: {
		      answer = this.answerForm.controls['thirdAns'].value
		      break;
		   }
		}
			questionArray.push({
				'id': item.question_id,
				'question': item.question,
				'answer': answer.toLowerCase()
			})
		})
		console.log(questionArray);
		this.auth.answerQuestions(questionArray).subscribe(data =>{
			console.log(data);
			if(data != false){
				this.loading.dismiss();
				this.navCtrl.push(ChangePassPage, {
					userId: data.user_id
				});
			}else{
				this.showError('One or more answers are wrong, please try again')
			}
		})
	}

	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
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

}
