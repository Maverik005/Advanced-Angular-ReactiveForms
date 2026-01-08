import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export class CustomValidators{

    static passwordMatch(passwordField:string, confirmPasswordField:string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const formGroup = control as FormGroup;
            const password = formGroup.get(passwordField);
            const confirmPassword = formGroup.get(confirmPasswordField);

            if(!password || !confirmPassword){
                return null;
            }

            if (confirmPassword.errors && !confirmPassword.errors['passwordMatch']) {
                return null;
            }

            if(password.value !== confirmPassword.value){
                confirmPassword.setErrors({passwordMatch: true});
                return { passwordMatch: true };
            } else{
                confirmPassword.setErrors(null);
                return null;
            }
        }
    }

    static passwordStrength(minScore:number = 2) {
        return (control: FormGroup): ValidationErrors | null => {
            const value = control.value;

            if (!value) {
                return null;
            }

            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumeric = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const isLongEnough = value.length >= 8;

            let score = 0;
            if (hasUpperCase) score++;
            if (hasLowerCase) score++;
            if (hasNumeric) score++;
            if (hasSpecialChar) score++;
            if (isLongEnough) score++;

            if (score < minScore) {
                return {
                passwordStrength: {
                    score,
                    minScore,
                    feedback: CustomValidators.getPasswordFeedback(
                    hasUpperCase,
                    hasLowerCase,
                    hasNumeric,
                    hasSpecialChar,
                    isLongEnough
                    )
                }
                };
            }

            return null;
        }
    }

    static getPasswordFeedback(
         hasUpperCase: boolean,
        hasLowerCase: boolean,
        hasNumeric: boolean,
        hasSpecialChar: boolean,
        isLongEnough: boolean
    ): string[] {
        const feedback: string[] = [];

        if (!isLongEnough) feedback.push('Password must be at least 8 characters');
        if (!hasUpperCase) feedback.push('Add uppercase letters');
        if (!hasLowerCase) feedback.push('Add lowercase letters');
        if (!hasNumeric) feedback.push('Add numbers');
        if (!hasSpecialChar) feedback.push('Add special characters');

        return feedback;
    }

     // Phone Number Validator
    static phoneNumber(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            // US phone format: (123) 456-7890 or 123-456-7890
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

            if (!phoneRegex.test(control.value)) {
                return { phoneNumber: true };
            }

            return null;
        };
    }

     static ageRange(minAge: number, maxAge: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const birthDate = new Date(control.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < minAge || age > maxAge) {
            return { ageRange: { minAge, maxAge, actualAge: age } };
                }

        return null;
        };
    } 

    static dateRange(startDateField: string, endDateField: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        const formGroup = control as FormGroup;
        const startDate = formGroup.get(startDateField);
        const endDate = formGroup.get(endDateField);

        if (!startDate || !endDate || !startDate.value || !endDate.value) {
            return null;
        }

        if (new Date(startDate.value) > new Date(endDate.value)) {
            endDate.setErrors({ dateRange: true });
            return { dateRange: true };
        }

        if (endDate.errors?.['dateRange']) {
            endDate.setErrors(null);
        }

        return null;
        };
    }

    // URL Validator
    static url(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        try {
            new URL(control.value);
            return null;
        } catch {
            return { url: true };
        }
        };
    }

    static zipCode(countryControl: AbstractControl): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value || !countryControl.value) {
            return null;
        }

        const zipPatterns: { [key: string]: RegExp } = {
            'US': /^\d{5}(-\d{4})?$/,
            'CA': /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
            'UK': /^[A-Z]{1,2}\d{1,2} \d[A-Z]{2}$/,
            'DE': /^\d{5}$/,
            'FR': /^\d{5}$/
        };

        const pattern = zipPatterns[countryControl.value];

        if (!pattern) {
            return null; // Country not in list, skip validation
        }

        if (!pattern.test(control.value)) {
            return { zipCode: { country: countryControl.value } };
        }

        return null;
        };
    }

    static conditionalRequired(
        condition: () => boolean
    ): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        if (!condition()) {
            return null;
        }

        if (!control.value || control.value.trim() === '') {
            return { required: true };
        }

        return null;
        };
    }

    static minDate(minDate: Date): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const controlDate = new Date(control.value);

        if (controlDate < minDate) {
            return { minDate: { minDate: minDate.toISOString(), actualDate: controlDate.toISOString() } };
        }

        return null;
        };
    }

    // Max Date Validator
    static maxDate(maxDate: Date): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const controlDate = new Date(control.value);

        if (controlDate > maxDate) {
            return { maxDate: { maxDate: maxDate.toISOString(), actualDate: controlDate.toISOString() } };
        }

        return null;
        };
    }

    // File Size Validator
    static fileSize(maxSizeInMB: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;

        if (!file) {
            return null;
        }

        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file.size > maxSizeInBytes) {
            return { fileSize: { maxSize: maxSizeInMB, actualSize: (file.size / 1024 / 1024).toFixed(2) } };
        }

        return null;
        };
    }

    // File Type Validator
    static fileType(allowedTypes: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
        const file = control.value as File;

        if (!file) {
            return null;
        }

            const fileExtension = file.name.split('.').pop()?.toLowerCase();

            if (!fileExtension || !allowedTypes.includes(fileExtension)) {
                return { fileType: { allowedTypes, actualType: fileExtension } };
            }

            return null;
        };
    }

}