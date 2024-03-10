# Bug Tracker

A bug tracker.

## Getting Started

First copy the `.env.example` to `.env.local` and add enter the correct values.

```bash
cp .env.example .env.local
```

Run the install script

```bash
bun i
```

Run the dev server

```bash
bun dev
```

## Tools

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)
- [Mantine](https://mantine.dev/)
- [Tabler Icons](https://tabler.io/docs/icons/react)
- [Zod](https://zod.dev/)

## Migrations

Turso/Prisma Docs - [Link](https://www.prisma.io/docs/orm/overview/databases/turso)

We make use of the dev.db located in the prisma/throwaway folder - [Link](./prisma/throwaway/).

Run this command to generate the new sql updates (the diff between the ./dev.db and your new prisma updates)

```bash
bun prisma:make-migration
```

```bash
turso db shell {PRISMA_DB_NAME} < ./prisma/migrations/{MIGRATION_GENERATED}/migration.sql
```

<details>
<summary>T3 app</summary>
This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
</details>
