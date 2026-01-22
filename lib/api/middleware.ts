import { NextRequest, NextResponse } from 'next/server';
import {
  validateApiKey,
  ApiKeyValidationResult,
  ApiKeyMode,
} from '@/lib/auth/api-keys';
import { db } from '@/lib/db/drizzle';
import { usageLogs } from '@/lib/db/schema';
import { apiError, handleApiError } from './errors';

export type ApiContext = {
  userId: number;
  teamId?: number;
  mode: ApiKeyMode;
  apiKeyId: string;
};

export type ApiHandler<T = Record<string, string>> = (
  request: NextRequest,
  context: ApiContext,
  params: T
) => Promise<NextResponse>;

/**
 * Wrap an API route with authentication and usage logging
 */
export function withApiAuth<T extends Record<string, string> = Record<string, string>>(
  handler: ApiHandler<T>
) {
  return async (
    request: NextRequest,
    { params }: { params?: Promise<T> }
  ): Promise<NextResponse> => {
    const startTime = Date.now();
    const authHeader = request.headers.get('Authorization');

    const validation = await validateApiKey(authHeader);

    if (!validation.valid) {
      return apiError(validation.error || 'Unauthorized', 'UNAUTHORIZED', 401);
    }

    const context: ApiContext = {
      userId: validation.userId!,
      teamId: validation.teamId,
      mode: validation.mode!,
      apiKeyId: validation.apiKeyId!,
    };

    try {
      const resolvedParams = params ? await params : ({} as T);
      const response = await handler(request, context, resolvedParams);

      // Log API usage (fire and forget)
      logApiUsage({
        userId: context.userId,
        teamId: context.teamId,
        apiKeyId: context.apiKeyId,
        endpoint: request.nextUrl.pathname,
        method: request.method,
        statusCode: response.status,
        responseTimeMs: Date.now() - startTime,
      }).catch(console.error);

      return response;
    } catch (error) {
      // Log failed request
      logApiUsage({
        userId: context.userId,
        teamId: context.teamId,
        apiKeyId: context.apiKeyId,
        endpoint: request.nextUrl.pathname,
        method: request.method,
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
      }).catch(console.error);

      return handleApiError(error);
    }
  };
}

async function logApiUsage(data: {
  userId: number;
  teamId?: number;
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTimeMs: number;
}) {
  try {
    await db.insert(usageLogs).values({
      userId: data.userId,
      teamId: data.teamId ?? null,
      apiKeyId: data.apiKeyId,
      endpoint: data.endpoint,
      method: data.method,
      statusCode: data.statusCode,
      responseTimeMs: data.responseTimeMs,
    });
  } catch (error) {
    console.error('Failed to log API usage:', error);
  }
}

/**
 * Helper to parse JSON body with error handling
 */
export async function parseJsonBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON body');
  }
}

/**
 * Standard success response helper
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}
