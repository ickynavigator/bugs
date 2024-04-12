import { useRouter } from 'next/navigation';
import { use } from 'react';
import { getSession } from '~/server/auth/react';

const useAuthed = async () => {
  const session = use(getSession());
  const router = useRouter();

  if (!session) {
    router.push('/login');
  }
};

export default useAuthed;
