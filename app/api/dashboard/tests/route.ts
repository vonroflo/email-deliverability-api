import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { tests, teamMembers } from '@/lib/db/schema';
import { inngest } from '@/lib/jobs/inngest';
import { eq, desc } from 'drizzle-orm';

// Create test(s) from dashboard - supports single and bulk
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Check if bulk or single test
    const isBulk = Array.isArray(body.tests);
    const testInputs = isBulk ? body.tests : [body];

    // Validate inputs
    if (testInputs.length === 0) {
      return NextResponse.json({ error: 'No tests provided' }, { status: 400 });
    }

    if (testInputs.length > 50) {
      return NextResponse.json({ error: 'Maximum 50 tests per batch' }, { status: 400 });
    }

    // Get user's team (if any) through teamMembers
    const membership = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, session.user.id),
    });

    const createdTests = [];

    for (const input of testInputs) {
      const { from, subject, html, text } = input;

      if (!from || !subject) {
        continue; // Skip invalid entries
      }

      // Create test record
      const [newTest] = await db
        .insert(tests)
        .values({
          userId: session.user.id,
          teamId: membership?.teamId ?? null,
          status: 'processing',
          fromAddress: from,
          subject,
          htmlContent: html ?? null,
          textContent: text ?? null,
          inboxPlacement: {
            gmail: 'pending',
            outlook: 'pending',
            yahoo: 'pending',
          },
        })
        .returning();

      // Trigger background job (don't fail if Inngest is not configured)
      try {
        await inngest.send({
          name: 'test/created',
          data: {
            testId: newTest.id,
            userId: session.user.id,
            mode: 'live', // Dashboard tests are always live
          },
        });
      } catch (inngestError) {
        console.error('Failed to queue test job:', inngestError);
        // Continue - test is created, job will need to be processed manually or retried
      }

      createdTests.push({
        id: newTest.id,
        from: newTest.fromAddress,
        subject: newTest.subject,
        status: newTest.status,
        created_at: newTest.createdAt.toISOString(),
      });
    }

    if (createdTests.length === 0) {
      return NextResponse.json({ error: 'No valid tests to create' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      count: createdTests.length,
      tests: createdTests,
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to create test:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create test', details: message }, { status: 500 });
  }
}

// Get user's tests
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const userTests = await db.query.tests.findMany({
      where: eq(tests.userId, session.user.id),
      orderBy: [desc(tests.createdAt)],
      limit,
      offset,
    });

    return NextResponse.json({
      tests: userTests.map(test => ({
        id: test.id,
        from: test.fromAddress,
        subject: test.subject,
        status: test.status,
        inbox_placement: test.inboxPlacement,
        spam_score: test.spamScore,
        authentication: test.authenticationResults,
        recommendations: test.recommendations,
        created_at: test.createdAt.toISOString(),
        completed_at: test.completedAt?.toISOString() ?? null,
      })),
    });

  } catch (error) {
    console.error('Failed to fetch tests:', error);
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
  }
}
