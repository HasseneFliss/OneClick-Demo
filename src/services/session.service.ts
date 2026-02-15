import Redis from 'ioredis';
import crypto from 'crypto';
import { config } from '../config';

export class SessionService {
  private redis: Redis;
  private readonly MAX_SESSIONS = 3;
  private readonly SESSION_PREFIX = 'session:';
  private readonly USER_SESSIONS_PREFIX = 'user_sessions:';

  constructor() {
    this.redis = new Redis(config.redis.url);
  }

  async create(userId: string, refreshToken: string, rememberMe: boolean): Promise<string> {
    const sessionId = crypto.randomUUID();
    const tokenHash = this.hashToken(refreshToken);
    const ttl = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 or 7 days

    // Check session limit
    const existingSessions = await this.getUserSessions(userId);
    if (existingSessions.length >= this.MAX_SESSIONS) {
      // Revoke oldest session
      const oldest = existingSessions[0];
      await this.revoke(oldest.sessionId);
    }

    // Store session
    const sessionData = {
      userId,
      tokenHash,
      createdAt: Date.now(),
      deviceInfo: {},
      ipAddress: null
    };

    await this.redis.setex(
      `${this.SESSION_PREFIX}${sessionId}`,
      ttl,
      JSON.stringify(sessionData)
    );

    // Add to user sessions set
    await this.redis.zadd(
      `${this.USER_SESSIONS_PREFIX}${userId}`,
      Date.now(),
      sessionId
    );

    return sessionId;
  }

  async validate(sessionId: string, refreshToken: string): Promise<boolean> {
    const data = await this.redis.get(`${this.SESSION_PREFIX}${sessionId}`);
    if (!data) return false;

    const session = JSON.parse(data);
    const tokenHash = this.hashToken(refreshToken);
    return session.tokenHash === tokenHash;
  }

  async revoke(sessionId: string): Promise<void> {
    const data = await this.redis.get(`${this.SESSION_PREFIX}${sessionId}`);
    if (data) {
      const session = JSON.parse(data);
      await this.redis.zrem(`${this.USER_SESSIONS_PREFIX}${session.userId}`, sessionId);
    }
    await this.redis.del(`${this.SESSION_PREFIX}${sessionId}`);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const sessions = await this.getUserSessions(userId);
    for (const session of sessions) {
      await this.redis.del(`${this.SESSION_PREFIX}${session.sessionId}`);
    }
    await this.redis.del(`${this.USER_SESSIONS_PREFIX}${userId}`);
  }

  async getUserSessions(userId: string): Promise<Array<{ sessionId: string; createdAt: number }>> {
    const sessionIds = await this.redis.zrange(`${this.USER_SESSIONS_PREFIX}${userId}`, 0, -1, 'WITHSCORES');
    const sessions = [];
    for (let i = 0; i < sessionIds.length; i += 2) {
      sessions.push({ sessionId: sessionIds[i], createdAt: parseInt(sessionIds[i + 1]) });
    }
    return sessions;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
