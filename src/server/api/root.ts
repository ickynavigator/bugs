import { issueRouter } from '~/server/api/routers/issue';
import { createTRPCRouter } from '~/server/api/trpc';
import { notesRouter } from '~/server/api/routers/notes';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  issue: issueRouter,
  notes: notesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
