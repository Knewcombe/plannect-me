import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

/*
  Generated class for the Popover component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'popover',
  templateUrl: 'popover.html',
  providers: [AuthService]
})
export class PopoverComponent {

  profileId: string;

  constructor(private params: NavParams, private navCtl: ViewController, private auth: AuthService) {
    this.profileId = params.get('profileId');
  }

  report(){
    console.log('Will report the user to the admins');
    this.auth.reportUser(this.profileId).subscribe(data =>{
    },error =>{
      // this.showError(error);
    });
  }

}
