import { z } from 'zod';
import { KANBAN_TITLES } from '~/lib/constant';
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
        orderBy: { ordinal: 'asc' },
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

      const group = states.reduce<Record<string, typeof issues>>(
        (acc, state) => {
          return {
            ...acc,
            [`${KANBAN_TITLES.COLUMNS}-${state.id}`]: issues.filter(
              issue => issue.stateId === state.id,
            ),
          };
        },
        {},
      );

      return group;
    }),
  changeIssueStateOrdinal: protectedProcedure
    .input(z.object({ pid: z.number(), sid: z.number(), ordinal: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const states = await ctx.db.issueState.findMany({
        where: { Project: { id: input.pid } },
        select: { ordinal: true, id: true },
      });

      const state = states.find(s => s.id === input.sid);
      if (!state) return;

      const newOrdinal = input.ordinal;
      const oldOrdinal = state.ordinal;

      const diff = newOrdinal - oldOrdinal;
      const isUp = diff < 0;

      const statesToUpdate = states.filter(s => {
        if (isUp) return s.ordinal >= newOrdinal && s.ordinal < oldOrdinal;
        return s.ordinal <= newOrdinal && s.ordinal > oldOrdinal;
      });

      await ctx.db.$transaction(
        statesToUpdate.map(s =>
          ctx.db.issueState.update({
            where: { id: s.id },
            data: { ordinal: s.ordinal + (isUp ? 1 : -1) },
          }),
        ),
      );

      await ctx.db.issueState.update({
        where: { id: input.sid },
        data: { ordinal: newOrdinal },
      });
    }),
});
