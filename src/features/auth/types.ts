// Login request
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration request
export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

// Router state shape used by the auth pages
export interface LocationState {
  from?: {
    pathname: string;
  };
  successMessage?: string;
}
