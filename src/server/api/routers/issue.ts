import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const issueRouter = createTRPCRouter({
  getIssues: protectedProcedure
    .input(z.object({ projectId: z.number() }).optional())
    .query(({ ctx, input }) => {
      return ctx.db.issue.findMany({
        where: { Project: { id: input?.projectId } },
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
  getProjectByShortCode: protectedProcedure
    .input(z.object({ shortcode: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findFirst({
        where: {
          createdBy: { id: ctx.session.user.id },
          shortcode: input.shortcode,
        },
      });
    }),
  editProject: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        shortcode: z.string(),
        description: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          shortcode: input.shortcode,
          description: input.description,
        },
      });
    }),
  deleteProject: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({ where: { id: input } });
    }),
  createIssue: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        severity: z.number(),
        projectId: z.number(),
        stateId: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.issue.create({
        data: {
          name: input.name,
          description: input.description,
          severity: input.severity,
          Project: { connect: { id: input.projectId } },
          state: { connect: { id: input.stateId } },
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  createIssueState: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
        projectId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.issueState.create({
        data: {
          name: input.name,
          color: input.color,
          Project: { connect: { id: input.projectId } },
        },
      });
    }),
  getIssueStates: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.issueState.findMany({
        where: { Project: { id: input.projectId } },
        orderBy: { ordinal: 'desc' },
      });
    }),
  getGroupedIssuesByProject: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const states = await ctx.db.issueState.findMany({
        where: { Project: { id: input.projectId } },
      });

      const issues = await ctx.db.issue.findMany({
        where: { Project: { id: input.projectId } },
      });

      const group = states.reduce<
        Record<(typeof states)[number]['id'], typeof issues>
      >((acc, state) => {
        return {
          ...acc,
          [state.id]: issues.filter(issue => issue.stateId === state.id),
        };
      }, {});

      return group;
    }),
  changeIssueStateOrdinal: protectedProcedure
    .input(z.object({ id: z.number(), ordinal: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // also update the ordinal of the other states
      const states = await ctx.db.issueState.findMany({
        where: { Project: { id: input.id } },
      });

      const state = states.find(s => s.id === input.id);
      if (!state) {
        return null;
      }

      const otherStates = states.filter(s => s.id !== input.id);

      const newOrdinal = input.ordinal;
      const oldOrdinal = state.ordinal;

      const updatedStates = otherStates.map(s => {
        if (s.ordinal >= newOrdinal && s.ordinal < oldOrdinal) {
          return { ...s, ordinal: s.ordinal + 1 };
        }

        if (s.ordinal <= newOrdinal && s.ordinal > oldOrdinal) {
          return { ...s, ordinal: s.ordinal - 1 };
        }

        return s;
      });

      await ctx.db.issueState.update({
        where: { id: input.id },
        data: { ordinal: newOrdinal },
      });

      // use transactions
      await ctx.db.$transaction(
        updatedStates.map(s =>
          ctx.db.issueState.update({
            where: { id: s.id },
            data: { ordinal: s.ordinal },
          }),
        ),
      );
    }),
});
