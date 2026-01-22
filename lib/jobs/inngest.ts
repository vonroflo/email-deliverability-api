import { Inngest } from 'inngest';

// Define event types for type safety
export type Events = {
  'test/created': {
    data: {
      testId: string;
      userId: number;
      mode: 'live' | 'test';
    };
  };
  'test/check-placement': {
    data: {
      testId: string;
      testMarker: string;
    };
  };
};

// Create and export the Inngest client
export const inngest = new Inngest({
  id: 'email-deliverability-api',
});
