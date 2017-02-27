import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {SERVER_URL} from './config';
import {Observable} from 'rxjs/Observable';
import { User, UserInfo, ProfileInfo, TokenInfo } from '../providers/user'
import 'rxjs/add/operator/map';

let imageUpload = SERVER_URL + 'api/profiles/upload-base';
let downloadURL = SERVER_URL + 'api/profiles/download';
let updateURL = SERVER_URL + 'api/profiles/update-base'
let removeURL = SERVER_URL + 'api/profiles/remove_image'

export class Images {

	picture_id:number;
	imageBase64:string;
	changed:boolean;

  constructor(picture_id:number, imageBase64:string, changed:boolean) {
		this.picture_id = picture_id;
		this.imageBase64 = imageBase64;
		this.changed = changed;
  }
}

@Injectable()
export class ImageService {

	Image: Images;

  constructor(public http: Http, private user: User) {
    console.log("Images");
  }

	public uploadImages(tokenInfo, profileId, imageArray){

		let body = JSON.stringify({
			profileId: profileId,
			images: imageArray
		});

		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(imageUpload+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
				.map(res => res.json())
				.subscribe(
					data =>  {
						if(data.token != ''){
							this.user.updateToken(data.token);
						}
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

	public downloadImages(tokenInfo, profileId){

		let body = JSON.stringify({profileId: profileId});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(downloadURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
				.map(res => res.json())
				.subscribe(
					data =>  {
						if(data.token != ''){
							this.user.updateToken(data.token);
						}
						if(data != null){
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

	public removeImages(tokenInfo: TokenInfo, profileId, imageArray){

		let body = JSON.stringify({
			'profileId': profileId,
			'images': imageArray
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(removeURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
				.map(res => res.json())
				.subscribe(
					data =>  {
						if(data != false){
							if(data.token != ''){
								this.user.updateToken(data.token);
							}
							observer.next(true);
						}else{
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

	public updateImages(tokenInfo: TokenInfo, profileId, imageArray){
		let body = JSON.stringify({
			'profileId': profileId,
			'images': imageArray
		});
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return Observable.create(observer => {
			// At this point make a request to your backend to make a real check!
			this.http.post(updateURL+'?tokenRefresh='+tokenInfo.tokenRefresh+'&token='+tokenInfo.token, body, options)
				.map(res => res.json())
				.subscribe(
					data =>  {
						if(data != false){
							if(data.token != ''){
								this.user.updateToken(data.token);
							}
							observer.next(true);
						}else{
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
