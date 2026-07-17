// Local/demo user model — there is no backend, everything lives in localStorage.
export interface LocalUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Demo-only: plain text is fine here, this app has no real backend or password hashing. */
  password: string;
  imageUrl: string | null;
}

export type PublicUser = Omit<LocalUser, 'password'>;
