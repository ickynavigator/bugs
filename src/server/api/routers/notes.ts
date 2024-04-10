import { z } from 'zod';
import { TIPTAP_DUMMY_TEXT } from '~/lib/constant';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const notesRouter = createTRPCRouter({
  getNote: publicProcedure
    .input(z.object({ userId: z.string(), noteId: z.number() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.note.findFirst({
        where: { id: input.noteId, createdBy: { id: input.userId } },
      });

      return note;
    }),
  getNotes: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.note.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return res;
  }),
  createNote: protectedProcedure.mutation(async ({ ctx }) => {
    const isUserFirstNote =
      (await ctx.db.note.count({
        where: { createdBy: { id: ctx.session.user.id } },
      })) === 0;

    const res = await ctx.db.note.create({
      data: {
        name: 'Untitled note',
        content: isUserFirstNote ? TIPTAP_DUMMY_TEXT : '',
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });

    return res;
  }),
  deleteNote: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.note.delete({
        where: { id: input.id },
      });

      return res;
    }),
  renameNote: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.note.update({
        where: { id: input.id },
        data: { name: input.name },
      });

      return res;
    }),
  updateNoteContent: protectedProcedure
    .input(z.object({ id: z.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.note.update({
        where: { id: input.id },
        data: { content: input.content },
      });

      return res;
    }),
});
