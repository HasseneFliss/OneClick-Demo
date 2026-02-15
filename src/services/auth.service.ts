import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { SessionService } from './session.service';
import { EmailService } from './email.service';
import { PasswordHistoryService } from './passwordHistory.service';
import { config } from '../config';

export class AuthService {
  private readonly BCRYPT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly REMEMBER_ME_EXPIRY = '30d';

  constructor(
    private userModel: typeof User,
    private sessionService: SessionService,
    private emailService: EmailService,
    private passwordHistory: PasswordHistoryService
  ) {}

  async register(email: string, password: string): Promise<User> {
    // Check if email exists
    const existing = await this.userModel.findByEmail(email);
    if (existing) {
      const error = new Error('Email already registered');
      (error as any).code = 'EMAIL_EXISTS';
      throw error;
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, this.BCRYPT_ROUNDS);

    // Create user
    const user = await this.userModel.create({
      email,
      passwordHash,
      emailVerified: false,
      mfaEnabled: false
    });

    // Store password in history
    await this.passwordHistory.add(user.id, passwordHash);

    // Send verification email
    await this.emailService.sendVerificationEmail(user);

    return user;
  }

  async login(email: string, password: string, mfaCode?: string): Promise<LoginResult> {
    const user = await this.userModel.findByEmail(email);
    
    if (!user) {
      return { success: false, reason: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return { success: false, reason: 'ACCOUNT_LOCKED', message: 'Account is locked. Please try again later.' };
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      await this.handleFailedLogin(user);
      return { success: false, reason: 'INVALID_CREDENTIALS', message: 'Invalid email or password' };
    }

    // Check email verification
    if (!user.emailVerified) {
      return { success: false, reason: 'EMAIL_NOT_VERIFIED', message: 'Please verify your email first' };
    }

    // Check MFA if enabled
    if (user.mfaEnabled) {
      if (!mfaCode) {
        return { success: false, reason: 'MFA_REQUIRED', message: 'MFA code required' };
      }
      const validMfa = await this.verifyMfaCode(user, mfaCode);
      if (!validMfa) {
        return { success: false, reason: 'INVALID_MFA', message: 'Invalid MFA code' };
      }
    }

    // Reset failed attempts
    await this.userModel.update(user.id, { failedLoginAttempts: 0, lockedUntil: null });

    return { success: true, user };
  }

  async generateTokens(user: User, rememberMe: boolean = false) {
    const payload = { userId: user.id, email: user.email, roles: user.roles };
    
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, { 
      expiresIn: this.ACCESS_TOKEN_EXPIRY 
    });

    const refreshExpiry = rememberMe ? this.REMEMBER_ME_EXPIRY : this.REFRESH_TOKEN_EXPIRY;
    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwt.refreshSecret,
      { expiresIn: refreshExpiry }
    );

    // Store session in Redis
    await this.sessionService.create(user.id, refreshToken, rememberMe);

    return { accessToken, refreshToken };
  }

  private async handleFailedLogin(user: User) {
    const attempts = (user.failedLoginAttempts || 0) + 1;
    const updates: Partial<User> = { failedLoginAttempts: attempts };

    if (attempts >= 5) {
      updates.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }

    await this.userModel.update(user.id, updates);
  }
}
