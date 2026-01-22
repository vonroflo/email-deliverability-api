import { serve } from 'inngest/next';
import { inngest } from '@/lib/jobs/inngest';
import { processTest } from '@/lib/jobs/functions/process-test';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTest],
});
