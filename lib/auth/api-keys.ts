import crypto from 'crypto';
import { hash, compare } from 'bcryptjs';
import { db } from '@/lib/db/drizzle';
import { apiKeys, teamMembers } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

const SALT_ROUNDS = 10;

export type ApiKeyMode = 'live' | 'test';

export interface ApiKeyValidationResult {
  valid: boolean;
  userId?: number;
  teamId?: number;
  mode?: ApiKeyMode;
  apiKeyId?: string;
  error?: string;
}

export interface GeneratedApiKey {
  rawKey: string;
  keyPrefix: string;
  keyHash: string;
}

/**
 * Generate a new API key
 * Returns the raw key (only shown once) and the data to store
 */
export async function generateApiKey(
  mode: ApiKeyMode
): Promise<GeneratedApiKey> {
  const randomPart = crypto.randomBytes(32).toString('hex');
  const prefix = mode === 'live' ? 'sk_live_' : 'sk_test_';
  const rawKey = `${prefix}${randomPart}`;
  const keyPrefix = rawKey.substring(0, 16); // Store first 16 chars for identification
  const keyHash = await hash(rawKey, SALT_ROUNDS);

  return { rawKey, keyPrefix, keyHash };
}

/**
 * Create and store a new API key for a user
 */
export async function createApiKey(
  userId: number,
  mode: ApiKeyMode,
  name?: string
): Promise<{ rawKey: string; id: string }> {
  // Get user's team
  const membership = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, userId),
  });

  const { rawKey, keyPrefix, keyHash } = await generateApiKey(mode);

  const [newKey] = await db
    .insert(apiKeys)
    .values({
      userId,
      teamId: membership?.teamId ?? null,
      keyHash,
      keyPrefix,
      mode,
      name: name || `${mode === 'live' ? 'Live' : 'Test'} API Key`,
    })
    .returning({ id: apiKeys.id });

  return { rawKey, id: newKey.id };
}

/**
 * Validate an API key from Authorization header
 */
export async function validateApiKey(
  authHeader: string | null
): Promise<ApiKeyValidationResult> {
  if (!authHeader) {
    return { valid: false, error: 'Missing Authorization header' };
  }

  // Parse Bearer token
  const match = authHeader.match(/^Bearer\s+(sk_(live|test)_[a-f0-9]{64})$/i);
  if (!match) {
    return { valid: false, error: 'Invalid API key format' };
  }

  const rawKey = match[1];
  const mode: ApiKeyMode = rawKey.startsWith('sk_live_') ? 'live' : 'test';
  const keyPrefix = rawKey.substring(0, 16);

  // Find potential matching keys by prefix
  const potentialKeys = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyPrefix, keyPrefix), isNull(apiKeys.revokedAt)));

  // Verify against stored hash
  for (const key of potentialKeys) {
    const matches = await compare(rawKey, key.keyHash);
    if (matches) {
      // Update last used timestamp (fire and forget)
      db.update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, key.id))
        .then(() => {})
        .catch(console.error);

      return {
        valid: true,
        userId: key.userId,
        teamId: key.teamId ?? undefined,
        mode: key.mode as ApiKeyMode,
        apiKeyId: key.id,
      };
    }
  }

  return { valid: false, error: 'Invalid API key' };
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(
  keyId: string,
  userId: number
): Promise<boolean> {
  const result = await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)))
    .returning({ id: apiKeys.id });

  return result.length > 0;
}

/**
 * List API keys for a user (with masked key preview)
 */
export async function listApiKeys(userId: number) {
  const keys = await db
    .select({
      id: apiKeys.id,
      keyPrefix: apiKeys.keyPrefix,
      mode: apiKeys.mode,
      name: apiKeys.name,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, userId), isNull(apiKeys.revokedAt)))
    .orderBy(apiKeys.createdAt);

  return keys.map((key) => ({
    ...key,
    // Show only prefix with masked suffix
    maskedKey: `${key.keyPrefix}${'*'.repeat(52)}`,
  }));
}
