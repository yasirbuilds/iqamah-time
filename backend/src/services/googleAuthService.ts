import { OAuth2Client } from 'google-auth-library';
import { GoogleUserInfo } from '../types/auth';

class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID environment variable is required');
    }

    this.client = new OAuth2Client(clientId, clientSecret);
  }

  async verifyGoogleToken(token: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      console.error('Google token verification error:', error);
      throw new Error('Invalid Google token');
    }
  }
}

export const googleAuthService = new GoogleAuthService();
