import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistService {
  private readonly blacklistedTokens: Map<string, number> = new Map();

  add(token: string, expiresAt: number) {
    this.blacklistedTokens.set(token, expiresAt);
  }

  isBlacklisted(token: string): boolean {
    const expiresAt = this.blacklistedTokens.get(token);
    if (expiresAt) {
      if (Date.now() / 1000 > expiresAt) {
        this.blacklistedTokens.delete(token);
        return false;
      }
      return true;
    }
    return false;
  }
}
