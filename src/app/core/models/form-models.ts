// User Registration Models
export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date | null;
  gender: string;
  agreeToTerms: boolean;
}

// Address Models
export interface Address {
  id: string;
  type: AddressType;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export enum AddressType {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other'
}

// Skills Models
export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  yearsOfExperience: number;
  certifications: Certification[];
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface Certification {
  name: string;
  issuedBy: string;
  issuedDate: Date | null;
  expiryDate: Date | null;
  credentialId?: string;
}

// Preferences Models
export interface UserPreferences {
  newsletter: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  timezone: string;
  interests: string[];
  theme: 'light' | 'dark' | 'auto';
}

// Multi-Step Form Models
export interface CompleteProfile {
  personal: UserRegistration;
  addresses: Address[];
  skills: Skill[];
  preferences: UserPreferences;
  resume?: File;
}

// Validation Error Messages
export interface ValidationErrors {
  [key: string]: string;
}

// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: ValidationErrors;
}

// Form State
export interface FormState {
  isLoading: boolean;
  isSaving: boolean;
  isValid: boolean;
  isDirty: boolean;
  errors: ValidationErrors;
  lastSaved: Date | null;
}

// Password Strength
export interface PasswordStrength {
  score: number; // 0-4
  label: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
}

// Country & State Data
export interface Country {
  code: string;
  name: string;
  zipFormat: RegExp;
}

export interface State {
  code: string;
  name: string;
  countryCode: string;
}