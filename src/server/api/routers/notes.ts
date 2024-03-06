import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const notesRouter = createTRPCRouter({
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { Note: true },
    });

    return res?.Note ?? [];
  }),
});
