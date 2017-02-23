import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Images } from '../providers/image-service';
import 'rxjs/add/operator/map';

/*
  Generated class for the Member provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export class Members {

	profile_id:number
	averageRating: number
	rating:number
	fav:boolean
	country:string
	countryEmjo: string
	countryName: string
	gender:string
	allow_rating:boolean
	hidden:boolean
	visable_rating:boolean
	images: Array<Images> = []

  constructor(profile_id:number, country:string, gender:string, allow_rating:boolean, hidden:boolean, visable_rating:boolean) {
		this.profile_id = profile_id,
		this.averageRating = 0,
		this.rating = 0,
		this.fav = false,
		this.country = country,
		this.countryEmjo = '',
		this.countryName = '',
		this.gender = gender,
		this.allow_rating = allow_rating,
		this.hidden = hidden,
		this.visable_rating = visable_rating
  }
}
@Injectable()
export class Member {

	private Member: Members;

  constructor(public http: Http) {}

	public getProfileId(){
		return this.Member.profile_id;
	}

	public getCountry(){
		return this.Member.country;
	}

	public getAverage(){
		return this.Member.averageRating;
	}

	public getRating(){
		return this.Member.rating;
	}

	public getFav(){
		return this.Member.fav;
	}

	public getGender(){
		return this.Member.gender;
	}

	public getAllowRating(){
		return this.Member.allow_rating
	}

	public getHidden(){
		return this.Member.hidden
	}

	public getVisable(){
		return this.Member.visable_rating
	}

	public setAverage(average){
		this.Member.averageRating = average;
	}

	public setFav(fav){
		this.Member.fav = fav;
	}

	public setRating(rating){
		this.Member.rating = rating;
	}

}
