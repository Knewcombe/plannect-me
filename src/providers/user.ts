import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Images } from '../providers/image-service'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the User provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class UserInfo {
	date_of_birth:string;
	first_name:string;
	last_name:string;
	profile_id: string;
	user_email: string;
	user_id: string;
	pim: boolean;

  constructor(date_of_birth: string, first_name: string, last_name: string, profile_id: string, user_email: string, user_id: string) {
		this.date_of_birth = date_of_birth;
		this.first_name = first_name;
		this.last_name = last_name;
		this.profile_id = profile_id;
		this.user_email = user_email;
		this.user_id = user_id;
		this.pim = false;
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
export class User {

  private User: UserInfo;
	private Profile: ProfileInfo;
	private tokenInfo: TokenInfo;
  private Images: Array<Images> = [];

  constructor() {}

  public setUser(User: UserInfo){
    this.User = User;
  }

  public setProfile(Profile: ProfileInfo){
    this.Profile = Profile;
  }

  public setTokenInfo(tokenInfo: TokenInfo){
    this.tokenInfo = tokenInfo;
  }

  public setImages(Images: Array<Images>){
    this.Images = Images
  }

  public setImage(Image: Images){
    this.Images.push(Image);
  }

	public resetImages(){
		this.Images = [];
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

  public getImages(): Array<Images>{
    return this.Images;
  }

	public setPim(pim: boolean){
    this.User.pim = pim;
  }

  public getUserId(){
    return this.User.user_id;
  }

	public getPim(){
    return this.User.pim;
  }

  public getFirstName(){
    return this.User.first_name;
  }
  public getLastName(){
    return this.User.last_name;
  }

  public getGender(){
    return this.Profile.gender;
  }

  public getCountry(){
    return this.Profile.country;
  }

  public getEmail(){
    return this.User.user_email;
  }

  public getProfileId(){
    return this.Profile.profile_id;
  }

  public updateToken(token:string){
    this.tokenInfo.token = token;
		if(window.localStorage.getItem('token')){
			window.localStorage.setItem('token', JSON.stringify({
					tokenInfo: this.getToken()
			}))
		}else if(window.sessionStorage.getItem('token')){
			window.sessionStorage.setItem('token', JSON.stringify({
					tokenInfo: this.getToken()
			}))
		}
  }

	public removeUser(){
		this.User = null;
		this.Profile = null;
		this.tokenInfo = null;
	  this.Images = [];
	}

}
