import { ImapFlow } from 'imapflow';

export type PlacementResult =
  | 'inbox'
  | 'spam'
  | 'promotions'
  | 'junk'
  | 'bulk'
  | 'not_found';

export interface SeedInboxConfig {
  provider: 'gmail' | 'outlook' | 'yahoo';
  host: string;
  port: number;
  user: string;
  pass: string;
  spamFolders: string[];
}

/**
 * Get seed inbox configurations from environment variables
 */
function getSeedInboxConfigs(): SeedInboxConfig[] {
  const configs: SeedInboxConfig[] = [];

  if (process.env.SEED_GMAIL_USER && process.env.SEED_GMAIL_PASS) {
    configs.push({
      provider: 'gmail',
      host: 'imap.gmail.com',
      port: 993,
      user: process.env.SEED_GMAIL_USER,
      pass: process.env.SEED_GMAIL_PASS,
      spamFolders: ['[Gmail]/Spam'],
    });
  }

  if (process.env.SEED_OUTLOOK_USER && process.env.SEED_OUTLOOK_PASS) {
    configs.push({
      provider: 'outlook',
      host: 'outlook.office365.com',
      port: 993,
      user: process.env.SEED_OUTLOOK_USER,
      pass: process.env.SEED_OUTLOOK_PASS,
      spamFolders: ['Junk', 'Junk Email'],
    });
  }

  if (process.env.SEED_YAHOO_USER && process.env.SEED_YAHOO_PASS) {
    configs.push({
      provider: 'yahoo',
      host: 'imap.mail.yahoo.com',
      port: 993,
      user: process.env.SEED_YAHOO_USER,
      pass: process.env.SEED_YAHOO_PASS,
      spamFolders: ['Bulk Mail', 'Bulk', 'Spam'],
    });
  }

  return configs;
}

/**
 * Search for an email by test marker in a specific folder
 */
async function searchInFolder(
  client: ImapFlow,
  folder: string,
  testMarker: string
): Promise<boolean> {
  try {
    const lock = await client.getMailboxLock(folder);
    try {
      // Search for the test marker in the subject
      const messages = await client.search({
        subject: testMarker,
      });
      // search() returns false if no messages found, or an array of sequence numbers
      return Array.isArray(messages) && messages.length > 0;
    } finally {
      lock.release();
    }
  } catch (error) {
    // Folder might not exist, which is fine
    return false;
  }
}

/**
 * Check inbox placement for a single provider
 */
async function checkSingleInbox(
  config: SeedInboxConfig,
  testMarker: string
): Promise<PlacementResult> {
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    logger: false,
  });

  try {
    await client.connect();

    // Check INBOX first
    const inInbox = await searchInFolder(client, 'INBOX', testMarker);
    if (inInbox) {
      return 'inbox';
    }

    // Check spam/junk folders
    for (const spamFolder of config.spamFolders) {
      const inSpam = await searchInFolder(client, spamFolder, testMarker);
      if (inSpam) {
        // Return provider-specific spam folder name
        if (config.provider === 'gmail') return 'spam';
        if (config.provider === 'outlook') return 'junk';
        if (config.provider === 'yahoo') return 'bulk';
        return 'spam';
      }
    }

    // Check promotions (Gmail only)
    if (config.provider === 'gmail') {
      const inPromotions = await searchInFolder(
        client,
        '[Gmail]/Promotions',
        testMarker
      );
      if (inPromotions) {
        return 'promotions';
      }
    }

    return 'not_found';
  } catch (error) {
    console.error(`IMAP error for ${config.provider}:`, error);
    return 'not_found';
  } finally {
    try {
      await client.logout();
    } catch {
      // Ignore logout errors
    }
  }
}

/**
 * Check inbox placement across all configured seed inboxes
 */
export async function checkInboxPlacement(
  testMarker: string
): Promise<Record<string, PlacementResult>> {
  const configs = getSeedInboxConfigs();
  const results: Record<string, PlacementResult> = {};

  // Check all inboxes in parallel
  const checks = await Promise.allSettled(
    configs.map(async (config) => {
      const placement = await checkSingleInbox(config, testMarker);
      return { provider: config.provider, placement };
    })
  );

  for (const check of checks) {
    if (check.status === 'fulfilled') {
      results[check.value.provider] = check.value.placement;
    } else {
      console.error('Inbox check failed:', check.reason);
    }
  }

  return results;
}

/**
 * Test IMAP connection to a specific provider
 */
export async function testImapConnection(
  provider: 'gmail' | 'outlook' | 'yahoo'
): Promise<{ success: boolean; error?: string }> {
  const configs = getSeedInboxConfigs();
  const config = configs.find((c) => c.provider === provider);

  if (!config) {
    return { success: false, error: `${provider} not configured` };
  }

  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    logger: false,
  });

  try {
    await client.connect();
    await client.logout();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}
