import helmet from 'helmet';
import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

export const securityMiddleware = [
  // Security headers
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none']
      }
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true
  }),

  // CSRF protection
  csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production' } })
];

export function csrfTokenHandler(req: Request, res: Response, next: NextFunction) {
  res.locals.csrfToken = req.csrfToken();
  next();
}
