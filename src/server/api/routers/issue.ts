import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const issueRouter = createTRPCRouter({
  getIssues: publicProcedure.query(({ ctx }) => {
    return ctx.db.issue.findMany();
  }),
});
