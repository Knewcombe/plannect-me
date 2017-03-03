import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

/*
  Generated class for the CropingImage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-croping-image',
  templateUrl: 'croping-image.html'
})
export class CropingImagePage {
	@ViewChild('cropper', undefined) cropper:ImageCropperComponent;
	loading: Loading
	cropperSettings:CropperSettings;
	data:any;
	croppedWidth:number;
  croppedHeight:number;
  image:any = new Image();
	callback;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {
    this.showLoading();
		this.cropperSettings = new CropperSettings();
		this.cropperSettings.noFileInput = true;

    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = true;

		this.cropperSettings.touchRadius = 25;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.preserveSize = false
    this.cropperSettings.minWithRelativeToResolution = true

		this.cropperSettings.fileType = "image/jpg";

    this.callback = navParams.get('callback');

		this.data = {}
    // this.cropper.setImage()

	}

	ionViewDidLoad() {
		this.image.src = this.navParams.get('src');
    var that = this;
    this.image.onload = function() {
      that.cropper.setImage(that.image);
      that.loading.dismiss();
    }
  }

	cropped(bounds:Bounds) {
    this.croppedHeight = bounds.bottom-bounds.top;
    this.croppedWidth = bounds.right-bounds.left;
  }

	done(){
		this.callback(this.data.image).then(() => {
   		this.navCtrl.pop();
		});
	}

	showLoading() {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		this.loading.present();
	}

}
