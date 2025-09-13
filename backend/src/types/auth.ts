export interface GoogleUserInfo {
  googleId: string;
  email?: string;
  name?: string;
  avatar?: string;
  emailVerified?: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    provider: string;
    avatar?: string | null;
  };
}
