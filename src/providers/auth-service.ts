import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import {SERVER_URL} from './config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
// let favorites = [],
let loginURL = SERVER_URL + 'auth/authenticate'


export class UserInfo {
	date_of_birth:string;
	first_name:string;
	last_name:string;
	profile_id: string;
	user_email: string;
	user_id: string;

  constructor(date_of_birth: string, first_name: string, last_name: string, profile_id: string, user_email: string, user_id: string) {
		this.date_of_birth = date_of_birth;
		this.first_name = first_name;
		this.last_name = last_name;
		this.profile_id = profile_id;
		this.user_email = user_email;
		this.user_id = user_id;
  }
}

export class TokenInfo {
	token: string;
	tokenRefresh:boolean;

  constructor(token: string, tokenRefresh: boolean) {
		this.token = token;
		this.tokenRefresh = tokenRefresh;
  }
}

export class ProfileInfo {

	allow_rating:number;
	country:string;
	gender:string;
	hidden:number;
	profile_id:string;
	visable_rating:number;

  constructor(allow_rating:number, country:string, gender:string, hidden:number, profile_id:string, visable_rating:number) {
		this.allow_rating = allow_rating;
		this.country = country;
		this.gender = gender;
		this.hidden = hidden;
		this.profile_id = profile_id;
		this.visable_rating = visable_rating;
  }
}

@Injectable()
export class AuthService {
	User: UserInfo;
	Profile: ProfileInfo;
	tokenInfo: TokenInfo;

  constructor(public http: Http) {
    // console.log(loginURL);
  }

	public login(credentials) {
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
								this.User = new UserInfo(data.userInfo.date_of_birth, data.userInfo.first_name, data.userInfo.last_name, data.userInfo.profile_id, data.userInfo.user_email, data.userInfo.user_id);
								this.Profile = new ProfileInfo(data.profile.allow_rating, data.profile.country, data.profile.gender, data.profile.hidden, data.profile.profile_id, data.profile.visable_rating);
								this.tokenInfo = new TokenInfo(data.tokenInfo.token, data.tokenInfo.tokenRefresh);
								observer.next(true);
							}else{
								console.log("Nope");
								observer.next(false);
							}
							observer.complete();
						},
						err => {
							console.log("ERROR!: ", err);
						}
					);
      });
    }
  }

	public getUserInfo() : UserInfo {
    return this.User;
  }

	public getProfile() : ProfileInfo {
    return this.Profile;
  }

	public getToken() : TokenInfo{
		return this.tokenInfo;
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

}
