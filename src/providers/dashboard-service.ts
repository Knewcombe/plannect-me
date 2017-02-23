import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup } from '@angular/forms';
import { SERVER_URL } from './config';
import { Observable } from 'rxjs/Observable';
import { User, UserInfo, ProfileInfo, TokenInfo } from '../providers/user'
import { ImageService, Images } from '../providers/image-service'
import 'rxjs/add/operator/map';

/*
  Generated class for the DashboardService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

let GetMembersURL = SERVER_URL + 'api/profiles/getProfiles';
let GerAverageURL = SERVER_URL + 'api/profiles/profile_average'
let GetRatingURL = SERVER_URL + 'api/profiles/profile_rating'
let GetFavouiteURL = SERVER_URL + 'api/profiles/favourite_find'

@Injectable()
export class DashboardService {
	//Will need to get the information for the other members and and give them to the dashbaord to place into the members
	//class once it is complete will need to figure out image stuff

  constructor(private http: Http, private user: User) {}

	public getProfiles(tokenInfo, searchOptions, country, profileId){
		let body = JSON.stringify({
			profileId: [profileId],
			requestCountry: country,
			searchOptions: searchOptions
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(GetMembersURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
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

	public getAverage(tokenInfo, profileId){
		let body = JSON.stringify({
			profileId: profileId
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(GerAverageURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
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

	public getRating(tokenInfo, profileId, rateProfileId){
		let body = JSON.stringify({
			profileId: profileId,
			rateProfileId: rateProfileId
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(GetRatingURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
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

	public getFavouite(tokenInfo, profileId, favProfile){
		let body = JSON.stringify({
			profileId: profileId,
			favProfile: favProfile
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(GetFavouiteURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
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
