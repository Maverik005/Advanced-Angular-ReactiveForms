import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { inject } from '@angular/core';
import { MockApiService } from '../services/mock-api.service';

export class AsyncValidators{

    static userNameAvailable(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if(!control.value){
                return of(null);
            }

            const apiService = inject(MockApiService);

            return timer(500).pipe(
                switchMap(() => apiService.checkUsernameAvailability(control.value)),
                map(response => {
                   return response.available ? null : {userNameTaken: true};
                }),
                catchError(() => of(null))
            );
        };
    }

    static emailAvailable(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if(!control.value)
                return of(null);

            const apiService = inject(MockApiService);

            return timer(500).pipe(
                switchMap(() => apiService.checkEmailAvailability(control.value)),
                map( response =>{
                    return response.available ? null : {emailTaken: true};
                }),
                catchError(() => of(null))
            );
        }
    }

    static validEmailDomain(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value || !control.value.includes('@')) {
                return of(null);
            }

            const domain = control.value.split('@')[1];
            const apiService = inject(MockApiService);

            return timer(300).pipe(
                switchMap(() => apiService.validateEmailDomain(domain)),
                map(response => {
                return response.valid ? null : { invalidDomain: { domain } };
                }),
                catchError(() => of(null))
            );
        };
    }

    static validZipCode(countryCode: string): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }

            const apiService = inject(MockApiService);

            return timer(400).pipe(
                switchMap(() => apiService.validateZipCode(control.value, countryCode)),
                map(response => {
                return response.valid ? null : { invalidZipCode: true };
                }),
                catchError(() => of(null))
            );
        };
    }

    static validateBusinessRule<T>(
        validationFn: (value: T) => Observable<boolean>,
        errorKey: string
    ): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value) {
                return of(null);
            }

            return timer(300).pipe(
                switchMap(() => validationFn(control.value)),
                map(isValid => isValid ? null : { [errorKey]: true }),
                catchError(() => of(null))
            );
        };
    }
}