import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup } from '@angular/forms';
import { SERVER_URL } from './config';
import { Observable } from 'rxjs/Observable';
import { User, UserInfo, ProfileInfo, TokenInfo } from '../providers/user'
import { ImageService, Images } from '../providers/image-service'
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
// let favorites = [],
let loginURL = SERVER_URL + 'auth/authenticate'
let authURL = SERVER_URL + 'auth/sign_up'
let setQuesURL = SERVER_URL + 'auth/questions_add'
let UserUpdateURL = SERVER_URL + 'api/users/update_user'
let UpdatePassURL = SERVER_URL + 'api/users/change_password'
let GetQuestionsURl = SERVER_URL + 'auth/questions_get'
let AnswerQuestionURL = SERVER_URL + 'auth/answer_questions'
let ChangePassword = SERVER_URL + 'auth/forgot_change_password'
let GetUserURL = SERVER_URL + 'api/profiles/get_users_info'
let GetAllRatings = SERVER_URL + 'api/profiles/get_all_ratings'


@Injectable()
export class AuthService {

  constructor(public http: Http, private user: User, private image: ImageService) {
    // console.log(loginURL);
  }

	public login(credentials, keeploggedin) {
		console.log(credentials);
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
			let body = JSON.stringify(credentials);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
				this.http.post(loginURL, body, options)
        	.map(res => res.json())
					.subscribe(
						data =>  {
							if(data != false){
								console.log("Yes");
								this.user.setUser(new UserInfo(data.userInfo.date_of_birth, data.userInfo.first_name, data.userInfo.last_name, data.userInfo.profile_id, data.userInfo.user_email, data.userInfo.user_id));
								this.user.setProfile(new ProfileInfo(data.profile.allow_rating, data.profile.country, data.profile.gender, data.profile.hidden, data.profile.profile_id, data.profile.visable_rating));
								this.user.setTokenInfo(new TokenInfo(data.tokenInfo.token, keeploggedin));
								this.image.downloadImages(this.user.getToken(), this.user.getProfileId()).subscribe(data =>{
									if(data != false){
										if(data.length != 0){
											for (let image of data) {
													this.user.setImage(new Images(image.pictureId, 'data:image/JPEG;base64,'+image.image, false));
											}
										}
									}
									if(keeploggedin){
										window.sessionStorage.removeItem('user');
										window.sessionStorage.removeItem('token');
										window.localStorage.setItem('user', JSON.stringify({
											user: {
												userInfo: this.user.getUserInfo(),
												profileInfo: this.user.getProfile(),
											}
										}))
										window.localStorage.setItem('token', JSON.stringify({
												tokenInfo: this.user.getToken()
										}))
									}else{
										window.localStorage.removeItem('user');
										window.localStorage.removeItem('token');
										window.sessionStorage.setItem('user', JSON.stringify({
											user: {
												userInfo: this.user.getUserInfo(),
												profileInfo: this.user.getProfile()
											}
										}))
										window.sessionStorage.setItem('token', JSON.stringify({
												tokenInfo: this.user.getToken()
										}))
									}
									observer.next(true);
									observer.complete();
								});
							}else{
								console.log("Nope");
								observer.next(false);
							}
						},
						err => {
							observer.error('Unable to connect, please check connection');
							console.log("ERROR!: ", err);
						}
					);
      });
    }
  }

	public getUser(tokenInfo:TokenInfo, userId, profileId){
		let body = JSON.stringify({
			'userId': userId,
			'profileId': profileId
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(GetUserURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
				.map((res:Response) => res.json())
				.subscribe(
					data =>  {
						console.log(data);
						if(data.token != ''){
							this.user.updateToken(data.token);
						}
						if(data.data != false){
							observer.next(data.data);
						}else{
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}

	public saveUser(firstGroup: FormGroup, secondGroup: FormGroup){
		let body = JSON.stringify({
			'firstName': firstGroup.controls['firstName'].value,
			'lastName': firstGroup.controls['lastName'].value,
			'password': firstGroup.controls['passwords'].get('firstPass').value,
			'confirm_password': firstGroup.controls['passwords'].get('secondPass').value,
			'gender':firstGroup.controls['gender'].value,
			'country': firstGroup.controls['country'].value,
			'dob': firstGroup.controls['dob'].value,
			'email':firstGroup.controls['email'].value,
			'options':{
				'rating': secondGroup.controls['rating'].value,
				'visiableRate': secondGroup.controls['visiableRate'].value,
				'hidden': secondGroup.controls['hidden'].value
			}
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(authURL, body, options)
				.map((res:Response) => res.json())
				.subscribe(
					data =>  {
						console.log(data);
						if(data != false){
							console.log("Yes");
							observer.next(true);
						}else{
							console.log("Nope");
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}

	public setQuestions(user_id, group: FormGroup){
		let body = JSON.stringify({
			user_id: user_id,
			questions:{
				first:{
					question: group.controls['firstSq'].value,
					answer: group.controls['firstAns'].value
				},
				second:{
					question: group.controls['secondSq'].value,
					answer: group.controls['secondAns'].value
				},
				third:{
					question: group.controls['thirdSq'].value,
					answer: group.controls['thirdAns'].value
				},
			}
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(setQuesURL, body, options)
				.map(res => res.json())
				.subscribe(
					data =>  {
						console.log(data);
						if(data != false){
							console.log("Yes");
							observer.next(true);
						}else{
							console.log("Nope");
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}

	public updateUserInfo(tokenInfo:TokenInfo, userId, profileId, UserFormGroup: FormGroup){
			let body = JSON.stringify({
				'userId': userId,
				'profileId': profileId,
				'firstName': UserFormGroup.controls['firstName'].value,
				'lastName': UserFormGroup.controls['lastName'].value,
				'gender': UserFormGroup.controls['gender'].value,
				'country': UserFormGroup.controls['country'].value,
				'email': UserFormGroup.controls['email'].value,
				'options':{
					'rating': UserFormGroup.controls['rating'].value == true ? 1 : 0,
					'visiableRate': UserFormGroup.controls['visiableRate'].value == true ? 1 : 0,
					'hidden': UserFormGroup.controls['hidden'].value == true ? 1 : 0
				}
			});
			console.log(body);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
			return Observable.create(observer => {
				// At this point make a request to your backend to make a real check!
				this.http.post(UserUpdateURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
					.map((res:Response) => res.json())
					.subscribe(
						data =>  {
							console.log(data);
							if(data != false){
								console.log("Yes");
								if(data.token != ''){
									this.user.updateToken(data.token);
								}
								this.user.setUser(new UserInfo(data.data.userInfo.date_of_birth, data.data.userInfo.first_name, data.data.userInfo.last_name, data.data.userInfo.profile_id, data.data.userInfo.user_email, data.data.userInfo.user_id));
								this.user.setProfile(new ProfileInfo(data.data.profile.allow_rating, data.data.profile.country, data.data.profile.gender, data.data.profile.hidden, data.data.profile.profile_id, data.data.profile.visable_rating));
								observer.next(true);
							}else{
								console.log("Nope");
								observer.next(false);
							}
							observer.complete();
						},
						err => {
							observer.error('Unable to connect, please check connection');
							console.log("ERROR!: ", err);
						}
					);
			});
	}

	public changePassword(passForm: FormGroup, userId, tokenInfo: TokenInfo){
		let body = JSON.stringify({
			'userId': userId,
			'oldPassword': passForm.controls['oldPassword'].value,
			'newPassword': passForm.controls['newPasswords'].get('firstPass').value
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(UpdatePassURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
				.map((res:Response) => res.json())
				.subscribe(
					data =>  {
						if(data.token != ''){
							this.user.updateToken(data.token);
						}
						if(data.data != false){
							observer.next(data.data);
						}else{
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}

	public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

	public getQuestions(credentals){
		let body = JSON.stringify({
			email: credentals.email
		})
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(GetQuestionsURl ,body, options)
				.map((res:Response) => res.json())
				.subscribe(
					data =>  {
						console.log(data);
						if(data != false){
							console.log("Yes");
							observer.next(data);
						}else{
							console.log("Nope");
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}

	public answerQuestions(questionsArray){
		let body = JSON.stringify({
			questions:questionsArray
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(AnswerQuestionURL, body, options)
				.map((res:Response) => res.json())
				.subscribe(
					data =>  {
						if(data != false){
							observer.next(data);
						}else{
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}
	public forgotChangePassword(password, userId){
		let body = JSON.stringify({
			user_id: userId,
			newPassword: password
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(ChangePassword, body, options)
				.map((res:Response) => res.json())
				.subscribe(
					data =>  {
						if(data != false){
							observer.next(true);
						}else{
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}

	public getAllRating(tokenInfo, profileId){
		let body = JSON.stringify({
			profileId: profileId
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(GetAllRatings+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
				.map((res:Response) => res.json())
				.subscribe(
					data =>  {
						if(data.token != ''){
							this.user.updateToken(data.token);
						}
						if(data.data != false){
							observer.next(data.data);
						}else{
							observer.next(false);
						}
						observer.complete();
					},
					err => {
						observer.error('Unable to connect, please check connection');
						console.log("ERROR!: ", err);
					}
				);
		});
	}

}
