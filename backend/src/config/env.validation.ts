import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsOptional()
  @IsInt()
  @Min(1)
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST!: string;

  @IsInt()
  @Min(1)
  DATABASE_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  AI_SERVICE_URL!: string;
}

export function validate(config: Record<string, unknown>) {
  const configWithDefaults: Record<string, unknown> = {
    PORT: config.PORT ?? '3000',
    DATABASE_HOST: config.DATABASE_HOST ?? 'localhost',
    DATABASE_PORT: config.DATABASE_PORT ?? '5432',
    DATABASE_USERNAME: config.DATABASE_USERNAME ?? 'postgres',
    DATABASE_PASSWORD: config.DATABASE_PASSWORD ?? 'postgres',
    DATABASE_NAME: config.DATABASE_NAME ?? 'fact_checking',
    JWT_SECRET: config.JWT_SECRET ?? 'change-me-in-production',
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? '15m',
    JWT_REFRESH_SECRET:
      config.JWT_REFRESH_SECRET ?? 'change-me-refresh-in-production',
    JWT_REFRESH_EXPIRES_IN: config.JWT_REFRESH_EXPIRES_IN ?? '7d',
    AI_SERVICE_URL: config.AI_SERVICE_URL ?? 'http://localhost:8000',
  };

  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    configWithDefaults,
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
