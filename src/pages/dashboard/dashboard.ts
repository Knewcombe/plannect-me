import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController, Slides, IonicApp } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService, Images } from '../../providers/image-service';
import { CountryService } from '../../providers/country-service';
import { User, UserInfo, ProfileInfo, TokenInfo } from '../../providers/user'
import { AdMob } from '@ionic-native/admob';

import { Member, Members } from '../../providers/member'
import { DashboardService } from '../../providers/dashboard-service'

import { AuthService } from '../../providers/auth-service';

import { HomePage } from '../../pages/home/home'
import { ProfilePage } from '../../pages/profile/profile';
import { FavouitesPage } from '../../pages/favouites/favouites';
import { StatsPage } from '../../pages/stats/stats';

import { MemberListComponent } from '../../components/member-list/member-list'
import {LoadingModalComponent} from '../components/loading-modal/loading-modal';

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
	providers: [DashboardService, AdMob, AuthService]
})
export class DashboardPage {
  @ViewChild('memberSlider') memberSlider: Slides;
  imageSlider: Slides
	loading: Loading;
	members: Array<Members> = []
	text: string;
	_maxIndex = 5;
	_currentIndex = 0;
  _activeIndex = 0;
	countryList = [];
  rangeValue: any = { lower: 0, upper: 0 };
  _memeberChanged = false

  admobid = {
      banner: 'ca-app-pub-4424361334659470/9247609349', // or DFP format "/6253334/dfp_example_ad"
      // interstitial: 'ca-app-pub-xxx/kkk'
    }

	searchOptions = {
		country: '',
		gender: '',
		age:{
			min: 18,
			max: 100
		}
	}

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private loadingCtrl: LoadingController,
		private alertCtrl: AlertController, private user: User, private dash: DashboardService, private image: ImageService, private country: CountryService, private admob: AdMob, private auth: AuthService) {
    console.log('Seeing if this is called')
    this.getProfiles();
		this.countryList = this.country.getCountryList();
    this.rangeValue = {lower: this.searchOptions.age.min, upper: this.searchOptions.age.max};
    this.searchOptions.country = this.user.getCountry();

    this.auth.checkPurchase(this.user.getProfileId()).subscribe(data =>{
        console.log('Console call second')
        console.log(data)
        if(data == false){
          if(this.admob) this.admob.createBanner({
            adId: this.admobid.banner,
            position: this.admob.AD_POSITION.BOTTOM_CENTER,
            autoShow: true });
            this.user.setPim(false);
        }else{
          this.user.setPim(true);
          this.searchOptions.country = '';
          this.admob.removeBanner();
        }
    });
	}

  getProfiles(){
    this.showLoading();
    var rating = 0;
    var fav = false;
    var count = 0;
    this.dash.getProfiles(this.user.getToken(), this.searchOptions, this.user.getCountry(), this.user.getProfileId()).subscribe(data => {
      if(data != false){
        if(data.profile != null){
          if(data.profile.length > 0){
            var tempData = data;
            for(let item of data.profile){
              this.dash.getRating(this.user.getToken(), this.user.getProfileId(), item.profile_id).subscribe(ratingData =>{
                if(ratingData != false){
                  item.rating = ratingData[0].rate_amount;
                }else{
                  item.rating = 0;
                }
                this.dash.getFavouite(this.user.getToken(), this.user.getProfileId(), item.profile_id).subscribe(favData =>{
                  item.fav = favData;
                  if(item.rating != 0 || item.fav != false){
                    this.members.push(new Members(item.profile_id, item.country, item.rating, item.fav, item.gender, item.allow_rating, item.hidden, item.visable_rating));
                  }else{
                    this.members.unshift(new Members(item.profile_id, item.country, item.rating, item.fav, item.gender, item.allow_rating, item.hidden, item.visable_rating));
                  }
                  if(count == tempData.profile.length - 1){
                    this.loading.dismiss();
                    this.getMembers();
                  }else{
                    count++;
                  }
                },
                error => {
                  this.showError(error);
                })
              },
              error => {
                this.showError(error);
              })
            }
          }else{
            this.loading.dismiss();
            this.showMessage('No Members', 'No new members are found at this time. Please pull down on the page to refresh or refine your search options');
          }
        }else{
          this.loading.dismiss();
          this.navCtrl.setRoot(HomePage);
        }
      }else if(data == null){
        console.log("Nope");
        this.navCtrl.setRoot(HomePage);
      }
      console.log(this.members);
      console.log(this.countryList);
    },
    error => {
      this.showError(error);
    })
  }

	getMembers(){
    var tempIndex = 0;
    for(let member of this.members){
      if(tempIndex == this._currentIndex && this._currentIndex <= this._maxIndex){
        if(member.visable_rating){
          if(member.averageRating == 0){
            this.dash.getAverage(this.user.getToken(), member.profile_id).subscribe(data =>{
              if(data != false){
                member.averageRating = Math.ceil(data);
              }
            },
            error => {
              this.showError(error);
            })
          }
        }
        if(member.images.length <= 0){
          this.image.downloadImages(this.user.getToken(), member.profile_id).subscribe(data =>{
              if(data != false){
                for(let image of data){
                  member.images.push(new Images(image.pictureId, 'data:image/JPEG;base64,'+image.image, false))
                }
              }
          })
        }
        for(let countryInfo of this.countryList){
          if(member.country == countryInfo.alpha2 || member.country == countryInfo.alpha3){
            member.countryEmjo = countryInfo.emoji;
            member.countryName = countryInfo.name;
          }
        }
        this._currentIndex++
      }else{
        if(tempIndex == this.members.length - 1 && this._currentIndex != this.members.length - 1){
          this._maxIndex = this._currentIndex + 5;
          if(this._currentIndex >= this.members.length - 1){
            this._maxIndex = this.members.length
          }
        }
      }
      tempIndex++
    }
	}

  previous(){
    this.memberSlider.slidePrev();
  }

  next(){
    this.memberSlider.slideNext();
  }

	openMenu(){
		this.menuCtrl.enable(true, 'menuContent');
    this.menuCtrl.open('menuContent');
	}

  changeAge(){
    this.searchOptions.age.min = this.rangeValue.lower;
    this.searchOptions.age.max = this.rangeValue.upper;
  }

  search(){
		if(this.members.length > 0){
      this.members = [];
    }
		this.menuCtrl.close('searchContent');
    this.menuCtrl.enable(false, 'searchContent');
    if(this.memberSlider){
      this.memberSlider.lockSwipeToNext(false);
  		this.memberSlider.slideTo(0);
    }
    this._maxIndex = 5;
  	this._currentIndex = 0;
    this._activeIndex = 0 ;
    this.getProfiles();
  }

	doRefresh($event){
		if(this.members.length > 0){
      this.members = [];
    }
    if(this.memberSlider){
      this.memberSlider.lockSwipeToNext(false);
  		this.memberSlider.slideTo(0);
    }
    this._maxIndex = 5;
  	this._currentIndex = 0;
    this._activeIndex = 0 ;
    this.getProfiles();
		$event.complete();
	}

  clearSearch(){
    this.searchOptions = {
  		country: this.user.getPim() ? '' : this.user.getCountry(),
  		gender: '',
  		age:{
  			min: 18,
  			max: 100
  		}
  	}
    this.rangeValue.lower = this.searchOptions.age.min;
    this.rangeValue.upper = this.searchOptions.age.max;
    this.menuCtrl.close('searchContent');
    this.menuCtrl.enable(false, 'searchContent');
    if(this.members.length > 0){
      this.members = [];
    }
    this._maxIndex = 5;
  	this._currentIndex = 0;
    this._activeIndex = 0 ;
    this.getProfiles();
  }

  openSearchMenu(){
    this.menuCtrl.enable(true, 'searchContent');
    this.menuCtrl.open('searchContent');
  }

  ionSlideDrag(){
    this._memeberChanged = true;
  }

  slideChanged(){
    this._activeIndex = this.memberSlider.getActiveIndex();
    if((this.memberSlider.getActiveIndex()) >= (this.members.length - 1)){
      this.memberSlider.lockSwipeToNext(true);
    }else{
      this.memberSlider.lockSwipeToNext(false);
    }
    if(this.memberSlider.getActiveIndex() + 2 >= this._currentIndex){
      this.getMembers();
    }
	}

  changeSlide($event){
    if(!this._memeberChanged){
      if($event.offsetDirection == 4){
        this.memberSlider.slidePrev();
      }else if($event.offsetDirection == 2){
        this.memberSlider.slideNext();
      }
    }

    this._memeberChanged = false;
  }

	profile(){
		this.menuCtrl.close();
		this.navCtrl.push(ProfilePage)
	}

	favouites(){
		this.menuCtrl.close();
		this.navCtrl.push(FavouitesPage);
	}

	stats(){
		this.menuCtrl.close();
		this.navCtrl.push(StatsPage);
	}

	logout(){
		this.showLoading();
		if(window.localStorage.getItem('user') && window.localStorage.getItem('token')){
			window.localStorage.removeItem('user');
			window.localStorage.removeItem('token');
		}else if(window.sessionStorage.getItem('user') && window.sessionStorage.getItem('token')){
			window.sessionStorage.removeItem('user');
			window.sessionStorage.removeItem('token');
		}
    this.admob.removeBanner();
		this.loading.dismiss();
		this.navCtrl.setRoot(HomePage);
	}

	showMessage(title, text){

		this.loading.dismiss();
	  let alert = this.alertCtrl.create({
	    title: title,
	    subTitle: text,
	    buttons: ['OK']
	  });
		alert.present(prompt);
	}

	showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });

    alert.present(prompt);
  }

  showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

}
