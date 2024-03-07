import { useRouter } from 'next/navigation';
import { useSession } from '~/server/auth/react';

const useAuthed = async () => {
  const session = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/login');
  }
};

export default useAuthed;
