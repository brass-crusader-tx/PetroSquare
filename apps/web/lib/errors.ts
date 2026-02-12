import { DataEnvelope } from '@petrosquare/types';

export class DataError extends Error {
  code: string;
  details?: unknown;
  status: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500, details?: unknown) {
    super(message);
    this.name = 'DataError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function createErrorEnvelope(error: unknown): DataEnvelope<null> {
  if (error instanceof DataError) {
    return {
      status: 'degraded',
      data: null,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
  }

  if (error instanceof Error) {
    return {
      status: 'degraded',
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    };
  }

  return {
    status: 'degraded',
    data: null,
    error: {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred.'
    }
  };
}

export function createSuccessEnvelope<T>(data: T, provenance?: any): DataEnvelope<T> {
  return {
    status: 'ok',
    data,
    provenance
  };
}
