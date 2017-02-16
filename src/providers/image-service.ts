import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {SERVER_URL} from './config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

let imageUpload = SERVER_URL + 'api/profiles/upload-base';
let downloadURL = SERVER_URL + 'api/profiles/download';

export class Images {

	picture_id:number;
	imageBase64:string;

  constructor(picture_id:number, imageBase64:string) {
		this.picture_id = picture_id;
		this.imageBase64 = imageBase64;
  }
}

@Injectable()
export class ImageService {

	Image: Images;

  constructor(public http: Http) {
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
						if(data != false){
							console.log(data);
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
						if(data != false){
							observer.next(data[1].data);
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

	// public removeImages(imageId){
	//
	// 	let body = JSON.stringify(imageId);
	// 	let headers = new Headers({ 'Content-Type': 'application/json' });
	// 	let options = new RequestOptions({ headers: headers });
	//
	// 	return Observable.create(observer => {
	// 		// At this point make a request to your backend to make a real check!
	// 		this.http.post(loginURL, body, options)
	// 			.map(res => res.json())
	// 			.subscribe(
	// 				data =>  {
	// 					if(data != false){
	// 						console.log("Yes");
	// 						observer.next(true);
	// 					}else{
	// 						console.log("Nope");
	// 						observer.next(false);
	// 					}
	// 					observer.complete();
	// 				},
	// 				err => {
	// 					console.log("ERROR!: ", err);
	// 				}
	// 			);
	// 	});
	// }

	// public updateImages(imageArray){
	// 	let body = JSON.stringify(imageArray);
	// 	let headers = new Headers({ 'Content-Type': 'application/json' });
	// 	let options = new RequestOptions({ headers: headers });
	//
	// 	return Observable.create(observer => {
	// 		// At this point make a request to your backend to make a real check!
	// 		this.http.post(loginURL, body, options)
	// 			.map(res => res.json())
	// 			.subscribe(
	// 				data =>  {
	// 					if(data != false){
	// 						console.log("Yes");
	// 						observer.next(true);
	// 					}else{
	// 						console.log("Nope");
	// 						observer.next(false);
	// 					}
	// 					observer.complete();
	// 				},
	// 				err => {
	// 					console.log("ERROR!: ", err);
	// 				}
	// 			);
	// 	});
	// }
}
