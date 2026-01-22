import { withApiAuth, apiSuccess } from '@/lib/api/middleware';
import { Errors } from '@/lib/api/errors';
import { db } from '@/lib/db/drizzle';
import { tests } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

interface TestIdParams extends Record<string, string> {
  testId: string;
}

export const GET = withApiAuth<TestIdParams>(async (request, context, params) => {
  const { testId } = params;

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(testId)) {
    throw Errors.ValidationError('Invalid test ID format');
  }

  // Fetch test from database
  const test = await db.query.tests.findFirst({
    where: and(
      eq(tests.id, testId),
      eq(tests.userId, context.userId)
    ),
  });

  if (!test) {
    throw Errors.NotFound('Test');
  }

  // Format response based on test status
  const response: Record<string, unknown> = {
    test_id: test.id,
    status: test.status,
    created_at: test.createdAt.toISOString(),
  };

  if (test.status === 'processing') {
    // Calculate estimated completion (5 minutes from creation)
    const estimatedCompletion = new Date(test.createdAt.getTime() + 5 * 60 * 1000);
    response.estimated_completion = estimatedCompletion.toISOString();
  }

  if (test.status === 'completed') {
    response.completed_at = test.completedAt?.toISOString() ?? null;
    response.inbox_placement = test.inboxPlacement;
    response.spam_score = test.spamScore ? parseFloat(test.spamScore) : null;
    response.authentication = test.authenticationResults;
    response.recommendations = test.recommendations;
  }

  if (test.status === 'failed') {
    response.error = test.errorMessage ?? 'Test failed';
  }

  return apiSuccess(response);
});
