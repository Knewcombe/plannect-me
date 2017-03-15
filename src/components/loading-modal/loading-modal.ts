import { Component, Input } from '@angular/core';

/*
  Generated class for the LoadingModal component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'loading-modal',
  templateUrl: 'loading-modal.html'
})
export class LoadingModalComponent {

  isBusy: boolean;

  @Input()
  set setBool(isBusy: boolean) {
    // Here you can do what you want with the variable
    this.isBusy = isBusy;
  }

  get getBool() { return this.isBusy; }

  constructor() {
    // this.isBusy = false;
  }

  show(){
    this.isBusy = true;
  }

  hide(){
    this.isBusy = false;
  }

}
