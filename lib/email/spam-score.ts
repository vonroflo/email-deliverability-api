import { buildRawEmail } from './send';

const SPAMCHECK_API_URL = 'https://spamcheck.postmarkapp.com/filter';

export interface SpamRule {
  score: string;
  rule: string;
  description: string;
}

export interface SpamScoreResult {
  score: number;
  success: boolean;
  rules: SpamRule[];
  report?: string;
}

export interface SpamCheckParams {
  from: string;
  subject: string;
  html?: string;
  text?: string;
}

/**
 * Calculate spam score using Postmark's free SpamCheck API
 *
 * API Documentation: https://spamcheck.postmarkapp.com/
 *
 * The API accepts raw email content and returns:
 * - score: SpamAssassin score (lower is better, > 5 is spam)
 * - rules: Array of triggered spam rules
 * - success: Whether the check was successful
 */
export async function calculateSpamScore(
  params: SpamCheckParams
): Promise<SpamScoreResult> {
  // Build raw email content for SpamAssassin analysis
  const rawEmail = buildRawEmail({
    from: params.from,
    to: 'test@example.com', // Placeholder, not actually used for scoring
    subject: params.subject,
    html: params.html,
    text: params.text,
  });

  try {
    const response = await fetch(SPAMCHECK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: rawEmail,
        options: 'long', // Get detailed report with rules
      }),
    });

    if (!response.ok) {
      console.error('SpamCheck API error:', response.status, response.statusText);
      return {
        score: 0,
        success: false,
        rules: [],
        report: `API error: ${response.status}`,
      };
    }

    const data = await response.json();

    // Parse the response
    if (data.success) {
      const score = parseFloat(data.score) || 0;
      const rules = parseSpamRules(data.rules || data.report || '');

      return {
        score,
        success: true,
        rules,
        report: data.report,
      };
    }

    return {
      score: 0,
      success: false,
      rules: [],
      report: 'SpamCheck API returned unsuccessful response',
    };
  } catch (error) {
    console.error('SpamCheck API request failed:', error);
    return {
      score: 0,
      success: false,
      rules: [],
      report: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Parse spam rules from SpamAssassin report
 */
function parseSpamRules(report: string | SpamRule[]): SpamRule[] {
  // If already an array, return it
  if (Array.isArray(report)) {
    return report.map((rule) => ({
      score: String(rule.score || '0'),
      rule: rule.rule || 'UNKNOWN',
      description: rule.description || '',
    }));
  }

  // Parse text report
  if (typeof report !== 'string') {
    return [];
  }

  const rules: SpamRule[] = [];
  const lines = report.split('\n');

  for (const line of lines) {
    // Match SpamAssassin rule format: "score RULE_NAME description"
    // Example: " 0.1 HTML_MESSAGE HTML included in message"
    const match = line.match(/^\s*(-?\d+\.?\d*)\s+([A-Z0-9_]+)\s+(.*)$/);
    if (match) {
      rules.push({
        score: match[1],
        rule: match[2],
        description: match[3].trim(),
      });
    }
  }

  // Sort by absolute score (most impactful first)
  rules.sort(
    (a, b) => Math.abs(parseFloat(b.score)) - Math.abs(parseFloat(a.score))
  );

  return rules;
}

/**
 * Get spam score category
 */
export function getSpamScoreCategory(score: number): {
  category: 'excellent' | 'good' | 'warning' | 'spam';
  description: string;
} {
  if (score <= 0) {
    return {
      category: 'excellent',
      description: 'Excellent - very unlikely to be marked as spam',
    };
  }
  if (score <= 3) {
    return {
      category: 'good',
      description: 'Good - low spam risk',
    };
  }
  if (score <= 5) {
    return {
      category: 'warning',
      description: 'Warning - moderate spam risk, consider improvements',
    };
  }
  return {
    category: 'spam',
    description: 'High spam risk - likely to be filtered',
  };
}
