import { Injectable, signal, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormState } from '../models/form-models';
import { MockApiService } from './mock-api.service';

@Injectable({ providedIn: 'root' })
export class FormStateService {
  
  // Signals for form state
  private formStateSignal = signal<FormState>({
    isLoading: false,
    isSaving: false,
    isValid: false,
    isDirty: false,
    errors: {},
    lastSaved: null
  });

  // Public computed signals
  readonly formState = computed(() => this.formStateSignal());
  readonly isLoading = computed(() => this.formStateSignal().isLoading);
  readonly isSaving = computed(() => this.formStateSignal().isSaving);
  readonly canSubmit = computed(() => 
    this.formStateSignal().isValid && 
    !this.formStateSignal().isLoading &&
    !this.formStateSignal().isSaving
  );

  // Auto-save subject
  private autoSaveSubject = new Subject<any>();

  constructor(private api: MockApiService) {
    // Setup auto-save with debounce
    this.autoSaveSubject.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(data => {
      this.saveDraft(data);
    });
  }

  // Update form state
  updateFormState(updates: Partial<FormState>): void {
    this.formStateSignal.update(state => ({
      ...state,
      ...updates
    }));
  }

  // Monitor form changes
  monitorForm(form: FormGroup): void {
    // Status changes
    form.statusChanges.subscribe(status => {
      this.updateFormState({ 
        isValid: status === 'VALID',
        isDirty: form.dirty
      });
    });

    // Value changes for auto-save
    form.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      if (form.dirty) {
        this.triggerAutoSave(value);
      }
    });
  }

  // Trigger auto-save
  private triggerAutoSave(data: any): void {
    this.autoSaveSubject.next(data);
  }

  // Save draft
  saveDraft(data: any): void {
    this.updateFormState({ isSaving: true });

    this.api.saveDraft(data).subscribe({
      next: () => {
        this.updateFormState({ 
          isSaving: false,
          lastSaved: new Date()
        });
      },
      error: () => {
        this.updateFormState({ isSaving: false });
      }
    });
  }

  // Submit form
  submitForm(data: any): Promise<any> {
    this.updateFormState({ isLoading: true });

    return new Promise((resolve, reject) => {
      this.api.submitRegistration(data).subscribe({
        next: (response) => {
          this.updateFormState({ 
            isLoading: false,
            lastSaved: new Date()
          });
          resolve(response);
        },
        error: (error) => {
          this.updateFormState({ 
            isLoading: false,
            errors: error.errors || {}
          });
          reject(error);
        }
      });
    });
  }

  // Reset form state
  resetFormState(): void {
    this.formStateSignal.set({
      isLoading: false,
      isSaving: false,
      isValid: false,
      isDirty: false,
      errors: {},
      lastSaved: null
    });
  }

  // Get error messages
  getErrorMessage(fieldName: string, errors: any): string {
    if (!errors) return '';

    if (errors['required']) return `${fieldName} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['passwordMatch']) return 'Passwords do not match';
    if (errors['usernameTaken']) return 'Username is already taken';
    if (errors['emailTaken']) return 'Email is already registered';
    if (errors['phoneNumber']) return 'Invalid phone number format';
    if (errors['ageRange']) return `Age must be between ${errors['ageRange'].minAge} and ${errors['ageRange'].maxAge}`;
    if (errors['zipCode']) return 'Invalid zip code format';
    if (errors['url']) return 'Invalid URL format';
    if (errors['fileSize']) return `File size must be under ${errors['fileSize'].maxSize}MB`;
    if (errors['fileType']) return `Allowed types: ${errors['fileType'].allowedTypes.join(', ')}`;

    return 'Invalid value';
  }
}

