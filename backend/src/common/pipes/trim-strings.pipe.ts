import { Injectable, PipeTransform } from '@nestjs/common';

/**
 * Shared pipe utilities can be added here as the API grows.
 */
@Injectable()
export class TrimStringsPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.trim();
    }

    if (value !== null && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, entryValue]) => [
          key,
          typeof entryValue === 'string' ? entryValue.trim() : entryValue,
        ]),
      );
    }

    return value;
  }
}
