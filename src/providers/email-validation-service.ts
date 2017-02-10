import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import {SERVER_URL} from './config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the EmailValidationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

let emailCheckURL = SERVER_URL + 'auth/email_check'
@Injectable()
export class EmailValidationService {

	constructor(public http: Http) {
		console.log(emailCheckURL);
	}

	public CheckEmail(email){
		console.log("Testing this fucking shit")
		let body = JSON.stringify(email);
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			console.log("The fuck");
			// At this point make a request to your backend to make a real check!
			this.http.post(emailCheckURL, body, options)
				.map(res => res.json())
				.subscribe(
					data =>  {
						if(data != false){
							console.log("Yes");
							observer.next(null);
						}else{
							console.log("Nope");
							observer.next({"email_taken": true});
						}
					},
					err => {
						console.log("ERROR!: ", err);
					}
				);
		});
	}
}
