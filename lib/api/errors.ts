import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public override message: string,
    public code: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toResponse(): NextResponse {
    return NextResponse.json(
      {
        error: {
          message: this.message,
          code: this.code,
          status: this.status,
        },
      },
      { status: this.status }
    );
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return error.toResponse();
  }

  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return new ApiError(
      firstError?.message || 'Validation error',
      'VALIDATION_ERROR',
      400
    ).toResponse();
  }

  console.error('Unhandled API error:', error);
  return new ApiError(
    'An unexpected error occurred',
    'INTERNAL_ERROR',
    500
  ).toResponse();
}

// Predefined error factories
export const Errors = {
  Unauthorized: (message = 'Invalid or missing API key') =>
    new ApiError(message, 'UNAUTHORIZED', 401),

  Forbidden: (message = 'Access denied') =>
    new ApiError(message, 'FORBIDDEN', 403),

  NotFound: (resource: string) =>
    new ApiError(`${resource} not found`, 'NOT_FOUND', 404),

  ValidationError: (message: string) =>
    new ApiError(message, 'VALIDATION_ERROR', 400),

  RateLimitExceeded: () =>
    new ApiError('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429),

  TestFailed: (message: string) =>
    new ApiError(message, 'TEST_FAILED', 500),

  InternalError: (message = 'An unexpected error occurred') =>
    new ApiError(message, 'INTERNAL_ERROR', 500),
};

// Helper to create standard error response
export function apiError(
  message: string,
  code: string,
  status: number
): NextResponse {
  return NextResponse.json(
    {
      error: {
        message,
        code,
        status,
      },
    },
    { status }
  );
}
