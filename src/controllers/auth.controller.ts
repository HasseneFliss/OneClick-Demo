import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { validateEmail, validatePassword } from '../utils/validators';
import { RateLimiter } from '../middleware/rateLimit';
import { AuditService } from '../services/audit.service';

export class AuthController {
  constructor(
    private authService: AuthService,
    private auditService: AuditService,
    private rateLimiter: RateLimiter
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      if (!validatePassword(password)) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
        });
      }

      // Create user
      const user = await this.authService.register(email, password);

      // Log audit event
      await this.auditService.log('USER_REGISTERED', user.id, { email }, req);

      res.status(201).json({ 
        message: 'Registration successful. Please check your email for verification.',
        userId: user.id 
      });
    } catch (error) {
      if (error.code === 'EMAIL_EXISTS') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, mfaCode, rememberMe } = req.body;
      const clientIp = req.ip;

      // Check rate limit
      const rateLimitResult = await this.rateLimiter.check(email);
      if (!rateLimitResult.allowed) {
        await this.auditService.log('LOGIN_RATE_LIMITED', null, { email }, req);
        return res.status(429).json({ 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        });
      }

      // Authenticate
      const result = await this.authService.login(email, password, mfaCode);

      if (!result.success) {
        await this.rateLimiter.recordFailure(email);
        await this.auditService.log('LOGIN_FAILED', null, { email, reason: result.reason }, req);
        return res.status(401).json({ error: result.message });
      }

      // Generate tokens
      const tokens = await this.authService.generateTokens(result.user, rememberMe);

      await this.auditService.log('LOGIN_SUCCESS', result.user.id, { rememberMe }, req);

      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 900,
        user: {
          id: result.user.id,
          email: result.user.email,
          roles: result.user.roles
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshAccessToken(refreshToken);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.revokeSession(req.user.sessionId);
      await this.auditService.log('LOGOUT', req.user.id, {}, req);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}
