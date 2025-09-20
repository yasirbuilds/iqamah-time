import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { googleAuthService } from "../services/googleAuthService";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name,
        provider: 'LOCAL'
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is a Google user trying to login with password
    if (user.provider === 'GOOGLE') {
      return res.status(400).json({ 
        message: "This account was created with Google. Please sign in with Google." 
      });
    }

    // Verify password
    if (!user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    // Verify Google token
    const googleUser = await googleAuthService.verifyGoogleToken(token);

    if (!googleUser.email) {
      return res.status(400).json({ message: "Unable to get email from Google" });
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });

    if (user) {
      // Update existing user with Google info if they don't have it
      if (!user.googleId || user.provider === 'LOCAL') {
        user = await prisma.user.update({
          where: { email: googleUser.email },
          data: {
            googleId: googleUser.googleId,
            avatar: googleUser.avatar,
            provider: 'GOOGLE',
            name: user.name || googleUser.name, // Keep existing name if available
          }
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          googleId: googleUser.googleId,
          name: googleUser.name,
          avatar: googleUser.avatar,
          provider: 'GOOGLE',
        }
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.json({
      message: "Google sign-in successful",
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Google Sign-In error:', error);
    if (error instanceof Error && error.message === 'Invalid Google token') {
      return res.status(401).json({ message: "Invalid Google token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
