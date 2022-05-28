import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class EspaciosValidator {
    static solo(control: AbstractControl) : ValidationErrors | null {
        if((control.value as string).trim().length == 0){
            return {solo: true}
        }
  
        return null;
    }
}