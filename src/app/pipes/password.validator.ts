import {PATTERNS} from 'src/app/app.config';
import {AbstractControl} from '@angular/forms';
export class PasswordValidation {
    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('confirm').value; // to get value in input tag
       const passwordUpper = (password.match(PATTERNS.passwordUpper) != null);
       const passwordLower = (password.match(PATTERNS.passwordLower) !== null);
       const passwordNumeric = (password.match(PATTERNS.passwordNumeric) !== null);
       const passwordLength = (password.match(PATTERNS.passwordLength) !== null);
       const passwordMatch = (password === confirmPassword);
       let passwordErrors: any = {};
       if(!passwordUpper || !passwordLower || !passwordNumeric || !passwordLength){
           if(!passwordUpper){
             passwordErrors.uppercase = true;
           }
           if(!passwordLower){
            passwordErrors.lowercase = true;
           }
           if(!passwordNumeric){
            passwordErrors.numeric = true;
           } 
           if(!passwordLength){
            passwordErrors.length = true;
           }
           AC.get('password').setErrors(passwordErrors);
       }
        if(!passwordMatch) {
            AC.get('confirm').setErrors( {MatchPassword: true} )
        } else {
            return null;
        }
    }
}