import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../../providers/image-service';
import { CountryService } from '../../providers/country-service';

import { ProfilePage } from '../../pages/profile/profile';
import { FavouitesPage } from '../../pages/favouites/favouites';
import { StatsPage } from '../../pages/stats/stats';

/*
  Generated class for the Dashboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
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

}
