import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import {SERVER_URL} from './config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the CountryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
let countryURL = SERVER_URL + 'extra/contry_data'

export class CountryInfo {
	alpha2:string;
	alpha3:string;
	emoji:string;
	ioc:string;
	name:string;

  constructor(alpha2:string, alpha3:string, emoji:string, ioc:string, name:string,) {
		this.alpha2 = alpha2;
		this.alpha3 = alpha3;
		this.emoji = emoji;
		this.ioc = ioc;
		this.name = name;
  }
}

@Injectable()
export class CountryService {
	Country: CountryInfo[] = [];
  constructor(public http: Http) {
		if(window.sessionStorage.getItem('countryInfo')){
			for(let entry of JSON.parse(window.sessionStorage.getItem('countryInfo'))){
				this.Country.push(new CountryInfo(entry.alpha2, entry.alpha3, entry.emoji, entry.ioc, entry.name));
			}
		}else{
			// let body = JSON.stringify();
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });
			this.http.get(countryURL, options)
				.map(res => res.json())
				.subscribe( data =>  {
						data = data.sort((n1,n2) => {
						    if (n1.name > n2.name) {
						        return 1;
						    }

						    if (n1.name < n2.name) {
						        return -1;
						    }
						    return 0;
						});
						for (let entry of data) {
							if(entry.alpha2 === 'CA'){
									this.Country.splice(0, 0, new CountryInfo(entry.alpha2, entry.alpha3, entry.emoji, entry.ioc, entry.name));
							}else if(entry.alpha2 === 'US'){
									this.Country.splice(1, 0, new CountryInfo(entry.alpha2, entry.alpha3, entry.emoji, entry.ioc, entry.name));
							}else{
								this.Country.push(new CountryInfo(entry.alpha2, entry.alpha3, entry.emoji, entry.ioc, entry.name));
							}
						}
						window.sessionStorage.setItem('countryInfo', JSON.stringify(this.Country));
					},
					err => {
						console.log("ERROR!: ", err);
					}
				);
		}
  }

	public getCountryList(){
		return this.Country;
	}

	public getCountryInfo(code){

	}

}
