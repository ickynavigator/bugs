import { redirect } from 'next/navigation';
import { use } from 'react';
import { auth } from '~/server/auth';

const useAuthed = () => {
  const session = use(auth());

  if (!session) {
    redirect('/login');
  }
};

export default useAuthed;
