import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiResponse, Country, State } from '../models/form-models';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  
  // Simulate existing usernames
  private existingUsernames = ['john_doe', 'jane_smith', 'admin', 'user123'];
  
  // Simulate existing emails
  private existingEmails = ['john@example.com', 'jane@example.com', 'admin@test.com'];

  // Check Username Availability
  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    const available = !this.existingUsernames.includes(username.toLowerCase());
    
    return of({ available }).pipe(
      delay(800) // Simulate network delay
    );
  }

  // Check Email Availability
  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    const available = !this.existingEmails.includes(email.toLowerCase());
    
    return of({ available }).pipe(
      delay(700)
    );
  }

  // Validate Email Domain
  validateEmailDomain(domain: string): Observable<{ valid: boolean }> {
    // Simulate checking if domain exists
    const invalidDomains = ['fake.com', 'test123.com', 'invalid.net'];
    const valid = !invalidDomains.includes(domain.toLowerCase());
    
    return of({ valid }).pipe(
      delay(500)
    );
  }

  // Validate Zip Code
  validateZipCode(zipCode: string, countryCode: string): Observable<{ valid: boolean }> {
    // Simulate zip code validation via API
    const valid = zipCode.length >= 5; // Simple check
    
    return of({ valid }).pipe(
      delay(600)
    );
  }

  // Get Countries
  getCountries(): Observable<Country[]> {
    const countries: Country[] = [
      { code: 'US', name: 'United States', zipFormat: /^\d{5}(-\d{4})?$/ },
      { code: 'CA', name: 'Canada', zipFormat: /^[A-Z]\d[A-Z] \d[A-Z]\d$/ },
      { code: 'UK', name: 'United Kingdom', zipFormat: /^[A-Z]{1,2}\d{1,2} \d[A-Z]{2}$/ },
      { code: 'DE', name: 'Germany', zipFormat: /^\d{5}$/ },
      { code: 'FR', name: 'France', zipFormat: /^\d{5}$/ },
      { code: 'AU', name: 'Australia', zipFormat: /^\d{4}$/ },
      { code: 'JP', name: 'Japan', zipFormat: /^\d{3}-\d{4}$/ }
    ];

    return of(countries).pipe(delay(300));
  }

  // Get States by Country
  getStatesByCountry(countryCode: string): Observable<State[]> {
    const statesMap: { [key: string]: State[] } = {
      'US': [
        { code: 'CA', name: 'California', countryCode: 'US' },
        { code: 'NY', name: 'New York', countryCode: 'US' },
        { code: 'TX', name: 'Texas', countryCode: 'US' },
        { code: 'FL', name: 'Florida', countryCode: 'US' },
        { code: 'IL', name: 'Illinois', countryCode: 'US' },
        { code: 'WA', name: 'Washington', countryCode: 'US' }
      ],
      'CA': [
        { code: 'ON', name: 'Ontario', countryCode: 'CA' },
        { code: 'QC', name: 'Quebec', countryCode: 'CA' },
        { code: 'BC', name: 'British Columbia', countryCode: 'CA' },
        { code: 'AB', name: 'Alberta', countryCode: 'CA' }
      ]
    };

    const states = statesMap[countryCode] || [];
    return of(states).pipe(delay(300));
  }

  // Get Skills (for autocomplete)
  searchSkills(query: string): Observable<string[]> {
    const allSkills = [
      'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js',
      'Node.js', 'Python', 'Java', 'C#', 'PHP',
      'HTML', 'CSS', 'SCSS', 'SQL', 'MongoDB',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
      'Git', 'REST API', 'GraphQL', 'Testing', 'CI/CD'
    ];

    const filtered = allSkills.filter(skill => 
      skill.toLowerCase().includes(query.toLowerCase())
    );

    return of(filtered).pipe(delay(200));
  }

  // Submit Form Data
  submitRegistration(data: any): Observable<ApiResponse<any>> {
    console.log('Submitting registration:', data);

    return of({
      success: true,
      data: { id: 'user-' + Math.random().toString(36).substr(2, 9) },
      message: 'Registration successful!'
    }).pipe(delay(1500));
  }

  // Save Draft
  saveDraft(data: any): Observable<ApiResponse<any>> {
    console.log('Saving draft:', data);

    return of({
      success: true,
      message: 'Draft saved successfully!'
    }).pipe(delay(500));
  }
}
