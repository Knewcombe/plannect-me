import { Component, Input, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

import { Members } from '../../providers/member'

/*
  Generated class for the MemberList component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'member-list',
  templateUrl: 'member-list.html'
})
export class MemberListComponent {

	@ViewChild('memberSlider') memberSlider: Slides;
	@ViewChild('imageSlider') imageSlider: Slides;

	_member: Array<Members> = [];
	rating:number = 0

	@Input()
  set member(member: Array<Members>) {
    // Here you can do what you want with the variable
    this._member = member;
  }

  get member() { return this._member; }

  constructor() {
    console.log('Hello MemberList Component');
  }

	slideChanged(){
		console.log(this.memberSlider.length());
		console.log(this.imageSlider.length())
	}

	imageChange(){
	}

	nextSlide(){

	}

	prevSlide(){

	}

	favourite(profileId){

	}

	notFavourite(profileId){

	}

	ratingProfile(profileId){
		console.log(this.rating)
	}

}
