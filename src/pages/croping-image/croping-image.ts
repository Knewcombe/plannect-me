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
	$event:any;
	callback;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {

		this.cropperSettings = new CropperSettings();
		this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;

		this.cropperSettings.touchRadius = 30;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.preserveSize = false
    this.cropperSettings.minWithRelativeToResolution = true

		this.cropperSettings.fileType = "jpeg";

		this.data = {}

		this.$event = navParams.get('event');
		this.callback = navParams.get('callback');
		var image:any = new Image();
    var file:File = this.$event.dataTransfer ? this.$event.dataTransfer.files[0] : this.$event.target.files[0];
		var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);
    };
		myReader.readAsDataURL(file);
	}

	// ionViewDidLoad() {
	//
  // }

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
