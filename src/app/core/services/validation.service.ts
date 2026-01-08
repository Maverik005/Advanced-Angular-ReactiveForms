import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PasswordStrength } from '../models/form-models';

@Injectable({ providedIn: 'root' })
export class ValidationService {
  
  // Calculate password strength
  calculatePasswordStrength(password: string): PasswordStrength {
    if (!password) {
      return { score: 0, label: 'weak', feedback: ['Password is required'] };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score++;

    // Character variety
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Add numbers');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('Add special characters');

    // Common patterns (negative score)
    if (/(.)\1{2,}/.test(password)) {
      score--;
      feedback.push('Avoid repeated characters');
    }

    if (/^[0-9]+$/.test(password)) {
      score = 0;
      feedback.push('Do not use only numbers');
    }

    // Determine label
    let label: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score <= 2) label = 'weak';
    else if (score <= 4) label = 'medium';
    else if (score <= 5) label = 'strong';
    else label = 'very-strong';

    return { score, label, feedback };
  }

  // Get all errors from a form control
  getAllErrors(control: AbstractControl): string[] {
    if (!control.errors) return [];

    return Object.keys(control.errors).map(key => {
      const error = control.errors![key];
      return this.getErrorMessage(key, error);
    });
  }

  // Get single error message
  private getErrorMessage(errorKey: string, errorValue: any): string {
    const messages: { [key: string]: string } = {
      required: 'This field is required',
      email: 'Invalid email address',
      minlength: `Minimum ${errorValue.requiredLength} characters required`,
      maxlength: `Maximum ${errorValue.requiredLength} characters allowed`,
      min: `Minimum value is ${errorValue.min}`,
      max: `Maximum value is ${errorValue.max}`,
      pattern: 'Invalid format',
      passwordMatch: 'Passwords must match',
      usernameTaken: 'Username is already taken',
      emailTaken: 'Email is already registered',
      phoneNumber: 'Invalid phone number',
      ageRange: `Age must be between ${errorValue.minAge} and ${errorValue.maxAge}`,
      passwordStrength: errorValue.feedback.join(', ')
    };

    return messages[errorKey] || 'Invalid value';
  }

  // Check if field should show error
  shouldShowError(control: AbstractControl): boolean {
    return !!(control.invalid && (control.dirty || control.touched));
  }

  // Mark all fields as touched (for form submission)
  markAllAsTouched(control: AbstractControl): void {
    control.markAsTouched();

    if ('controls' in control) {
      const controls = (control as any).controls;
      Object.keys(controls).forEach(key => {
        this.markAllAsTouched(controls[key]);
      });
    }
  }
}
