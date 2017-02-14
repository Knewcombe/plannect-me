import { FormControl, AbstractControl } from '@angular/forms';
export interface AbstractControlWarn extends AbstractControl { warnings: any; }

export class AgeValidator {

    static isOlder(control: AbstractControlWarn){
      control.warnings = {toYoung: null};
      var today = new Date();
      var birthDate = new Date(control.value);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
        age--;
      }
      if(age){
        if(age > 18){
          console.log("Older then 18");
          control.warnings = {toYoung: false};
          return null;
        }else{
          console.log("Younger then 18");
          control.warnings = {toYoung: true};
          return null;
        }
      }else{
        return {
          "not realistic": true
        };
      }
    }
}
