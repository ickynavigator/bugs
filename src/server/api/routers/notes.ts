import { z } from 'zod';
import { TIPTAP_DUMMY_TEXT } from '~/lib/constant';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const notesRouter = createTRPCRouter({
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
