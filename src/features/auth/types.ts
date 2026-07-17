// Login request
export interface LoginCredentials {
  username: string;
  password: string;
}

// Reset password begin request
export interface ResetPasswordBeginRequest {
  address: string;
}

// Reset password verify request
export interface ResetPasswordVerifyRequest {
  address: string;
  code: string;
}

// Reset password commit request
export interface ResetPasswordCommitRequest {
  token: string;
  newPassword: string;
}

// Set mobile request
export interface SetMobileRequest {
  mobileNumber: string;
}

// Registration request
export interface RegisterCredentials {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  timezoneId: string
  phone?: string
  language?: string
  inviteToken?: string
}