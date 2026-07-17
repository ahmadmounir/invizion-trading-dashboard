// Local/demo authentication — no backend. Users live in localStorage; login just
// checks the submitted credentials against that list and mints a fake token so
// the rest of the app can keep working exactly like a real auth flow would.
import type { LocalUser, PublicUser } from '@/shared/types/user';
import { useProfileStore } from '@/shared/stores/profileStore';

const USERS_STORAGE_KEY = 'inviziontenantui-users';
const TOKEN_STORAGE_KEY = 'inviziontenantui-token';

const DEMO_USER: LocalUser = {
  id: 'demo-user',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@invizion.com',
  phone: '',
  password: 'Demo1234!',
  imageUrl: null,
};

export const DEMO_CREDENTIALS = {
  email: DEMO_USER.email,
  password: DEMO_USER.password,
};

const toPublicUser = (user: LocalUser): PublicUser => {
  const { id, firstName, lastName, email, phone, imageUrl } = user;
  return { id, firstName, lastName, email, phone, imageUrl };
};

export const getUsers = (): LocalUser[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEMO_USER]));
    return [DEMO_USER];
  }
  try {
    return JSON.parse(stored) as LocalUser[];
  } catch {
    return [DEMO_USER];
  }
};

const saveUsers = (users: LocalUser[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: PublicUser;
}

export const register = ({
  firstName,
  lastName,
  email,
  phone,
  password,
}: RegisterInput): AuthResult => {
  const users = getUsers();
  const emailTaken = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
  if (emailTaken) {
    return { success: false, message: 'An account with this email already exists' };
  }

  const newUser: LocalUser = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    phone,
    password,
    imageUrl: null,
  };
  saveUsers([...users, newUser]);

  return { success: true, user: toPublicUser(newUser) };
};

export const login = (email: string, password: string): AuthResult => {
  const users = getUsers();
  const match = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  );

  if (!match) {
    return { success: false, message: 'Invalid email or password' };
  }

  const token = crypto.randomUUID();
  localStorage.setItem(TOKEN_STORAGE_KEY, token);

  return { success: true, user: toPublicUser(match) };
};

export const logout = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  useProfileStore.getState().clearProfile();
};

export const getToken = (): string | null => localStorage.getItem(TOKEN_STORAGE_KEY);

export const isAuthenticated = (): boolean => !!getToken();

/**
 * Persist profile field updates back to the underlying users list too, so a
 * user's edited name/email/phone/avatar survives future logins, not just the
 * current session's profile store.
 */
export const updateStoredUser = (id: string, updates: Partial<PublicUser>): void => {
  const users = getUsers();
  saveUsers(
    users.map((user) => (user.id === id ? { ...user, ...updates } : user)),
  );
};
