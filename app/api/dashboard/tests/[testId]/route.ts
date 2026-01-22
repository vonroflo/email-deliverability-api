import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { tests } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Get single test by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testId } = await params;

    const test = await db.query.tests.findFirst({
      where: and(
        eq(tests.id, testId),
        eq(tests.userId, session.user.id)
      ),
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: test.id,
      from: test.fromAddress,
      subject: test.subject,
      html: test.htmlContent,
      text: test.textContent,
      status: test.status,
      test_marker: test.testMarker,
      inbox_placement: test.inboxPlacement,
      spam_score: test.spamScore,
      authentication: test.authenticationResults,
      recommendations: test.recommendations,
      created_at: test.createdAt.toISOString(),
      completed_at: test.completedAt?.toISOString() ?? null,
    });

  } catch (error) {
    console.error('Failed to fetch test:', error);
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 });
  }
}
