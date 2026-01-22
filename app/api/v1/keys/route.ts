import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUser } from '@/lib/db/queries';
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  type ApiKeyMode,
} from '@/lib/auth/api-keys';
import { apiError } from '@/lib/api/errors';

// Schema for creating a new API key
const createKeySchema = z.object({
  mode: z.enum(['live', 'test']),
  name: z.string().max(100).optional(),
});

// Schema for revoking an API key
const revokeKeySchema = z.object({
  key_id: z.string().uuid(),
});

/**
 * GET /api/v1/keys - List all API keys for the authenticated user
 * Requires session authentication (from dashboard)
 */
export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return apiError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const keys = await listApiKeys(user.id);

    return NextResponse.json({
      keys: keys.map((key) => ({
        id: key.id,
        name: key.name,
        mode: key.mode,
        masked_key: key.maskedKey,
        last_used_at: key.lastUsedAt?.toISOString() ?? null,
        created_at: key.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error listing API keys:', error);
    return apiError('Failed to list API keys', 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/v1/keys - Create a new API key
 * Requires session authentication (from dashboard)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return apiError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const body = await request.json();
    const result = createKeySchema.safeParse(body);

    if (!result.success) {
      return apiError(
        result.error.issues[0]?.message || 'Invalid request',
        'VALIDATION_ERROR',
        400
      );
    }

    const { mode, name } = result.data;

    const { rawKey, id } = await createApiKey(
      user.id,
      mode as ApiKeyMode,
      name
    );

    // Return the raw key - this is the only time it will be shown
    return NextResponse.json(
      {
        id,
        key: rawKey,
        mode,
        name: name || `${mode === 'live' ? 'Live' : 'Test'} API Key`,
        message:
          'Save this key securely. It will not be shown again.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating API key:', error);
    return apiError('Failed to create API key', 'INTERNAL_ERROR', 500);
  }
}

/**
 * DELETE /api/v1/keys - Revoke an API key
 * Requires session authentication (from dashboard)
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return apiError('Authentication required', 'UNAUTHORIZED', 401);
    }

    const body = await request.json();
    const result = revokeKeySchema.safeParse(body);

    if (!result.success) {
      return apiError(
        result.error.issues[0]?.message || 'Invalid request',
        'VALIDATION_ERROR',
        400
      );
    }

    const { key_id } = result.data;

    const revoked = await revokeApiKey(key_id, user.id);

    if (!revoked) {
      return apiError('API key not found', 'NOT_FOUND', 404);
    }

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return apiError('Failed to revoke API key', 'INTERNAL_ERROR', 500);
  }
}
