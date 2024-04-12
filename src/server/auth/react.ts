import type { DefaultSession } from 'next-auth';
import type { SessionContextValue } from 'next-auth/react';
import {
  useSession as useAuthSession,
  getSession as getAuthSession,
} from 'next-auth/react';

export { SessionProvider, signIn, signOut } from 'next-auth/react';

interface Session extends DefaultSession {
  user?: DefaultSession['user'] & {
    id: string;
  };
}

/**
 * @deprecated Use `useGetAuthedUser` instead. Since we don't wrap with a session provider.
 */
// @ts-expect-error Hacking the type so we don't have to do the module augmentation technique.
export const useSession: () => Session & SessionContextValue = useAuthSession;
export const getSession: () => Promise<Session | null> = getAuthSession;
