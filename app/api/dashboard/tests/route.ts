import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import { tests, teamMembers } from '@/lib/db/schema';
import { inngest } from '@/lib/jobs/inngest';
import { eq, desc } from 'drizzle-orm';

// Create test(s) from dashboard - supports single and bulk
export async function POST(request: NextRequest) {
  try {
    // Check session with specific error handling
    let session;
    try {
      session = await getSession();
    } catch (sessionError) {
      console.error('Session error:', sessionError);
      const msg = sessionError instanceof Error ? sessionError.message : 'Unknown';
      return NextResponse.json({ error: 'Authentication error', details: msg }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

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
    let membership;
    try {
      membership = await db.query.teamMembers.findFirst({
        where: eq(teamMembers.userId, session.user.id),
      });
    } catch (dbError) {
      console.error('Database error fetching team:', dbError);
      const msg = dbError instanceof Error ? dbError.message : 'Unknown';
      return NextResponse.json({ error: 'Database error', details: msg }, { status: 500 });
    }

    const createdTests = [];

    for (const input of testInputs) {
      const { from, subject, html, text } = input;

      if (!from || !subject) {
        continue; // Skip invalid entries
      }

      // Create test record
      let newTest;
      try {
        const [inserted] = await db
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
        newTest = inserted;
      } catch (insertError) {
        console.error('Database error inserting test:', insertError);
        const msg = insertError instanceof Error ? insertError.message : 'Unknown';
        return NextResponse.json({ error: 'Failed to create test in database', details: msg }, { status: 500 });
      }

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
    // Check session with specific error handling
    let session;
    try {
      session = await getSession();
    } catch (sessionError) {
      console.error('Session error:', sessionError);
      const msg = sessionError instanceof Error ? sessionError.message : 'Unknown';
      return NextResponse.json({ error: 'Authentication error', details: msg }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsedLimit = parseInt(searchParams.get('limit') || '20', 10);
    const parsedOffset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = Math.min(Number.isNaN(parsedLimit) ? 20 : Math.max(1, parsedLimit), 100);
    const offset = Number.isNaN(parsedOffset) ? 0 : Math.max(0, parsedOffset);

    let userTests;
    try {
      userTests = await db.query.tests.findMany({
        where: eq(tests.userId, session.user.id),
        orderBy: [desc(tests.createdAt)],
        limit,
        offset,
      });
    } catch (dbError) {
      console.error('Database error fetching tests:', dbError);
      const msg = dbError instanceof Error ? dbError.message : 'Unknown';
      return NextResponse.json({ error: 'Database error', details: msg }, { status: 500 });
    }

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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch tests', details: message }, { status: 500 });
  }
}
