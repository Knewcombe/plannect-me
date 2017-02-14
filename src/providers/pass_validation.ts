import { FormGroup } from '@angular/forms';

export class PassValidator {

    static areEqual(group: FormGroup){
      if(group.controls['firstPass'].valid == group.controls['secondPass'].valid){
        if(group.controls['firstPass'].value == group.controls['secondPass'].value){
          console.log("Pass");
          return null;
        }else{
          console.log("Fail");
          return {
            "no match": true
          };
        }
      }else{
        return null;
      }
    }
}
