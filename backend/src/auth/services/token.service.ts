import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { BusinessException } from '../../common/exceptions/business.exception';
import { User } from '../../users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { AuthTokens, AuthJwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async generateTokens(user: User): Promise<AuthTokens> {
    const payload: AuthJwtPayload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
      expiresIn: this.configService.getOrThrow('jwt.expiresIn'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: this.configService.getOrThrow('jwt.refreshExpiresIn'),
    });

    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ tokens: AuthTokens; user: User }> {
    await this.validateRefreshToken(refreshToken);

    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: this.hashToken(refreshToken), isRevoked: false },
      relations: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new BusinessException('Invalid or expired refresh token');
    }

    // Rotate refresh token: revoke the old one before issuing new tokens
    storedToken.isRevoked = true;
    await this.refreshTokenRepository.save(storedToken);

    const tokens = await this.generateTokens(storedToken.user);

    return { tokens, user: storedToken.user };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: this.hashToken(refreshToken), isRevoked: false },
    });

    if (storedToken) {
      storedToken.isRevoked = true;
      await this.refreshTokenRepository.save(storedToken);
    }
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const expiresAt = this.getRefreshTokenExpiry(refreshToken);

    const tokenEntity = this.refreshTokenRepository.create({
      userId,
      token: this.hashToken(refreshToken),
      expiresAt,
      isRevoked: false,
    });

    await this.refreshTokenRepository.save(tokenEntity);
  }

  private async validateRefreshToken(
    refreshToken: string,
  ): Promise<AuthJwtPayload> {
    try {
      return await this.jwtService.verifyAsync<AuthJwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new BusinessException('Invalid or expired refresh token');
    }
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getRefreshTokenExpiry(refreshToken: string): Date {
    const decoded: unknown = this.jwtService.decode(refreshToken);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'exp' in decoded &&
      typeof decoded.exp === 'number'
    ) {
      return new Date(decoded.exp * 1000);
    }

    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}
