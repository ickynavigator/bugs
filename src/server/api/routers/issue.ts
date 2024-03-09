import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const issueRouter = createTRPCRouter({
  getIssues: protectedProcedure.query(({ ctx }) => {
    return ctx.db.issue.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),
  checkShortcode: protectedProcedure
    .input(z.object({ shortcode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.project.count({
        where: {
          shortcode: input.shortcode,
          createdBy: { id: ctx.session.user.id },
        },
      });

      return res > 0;
    }),
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        shortcode: z.string(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          shortcode: input.shortcode,
          description: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.project.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return res ?? [];
  }),
});
