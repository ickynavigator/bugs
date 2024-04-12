import { use } from 'react';
import { getSession } from '~/server/auth/react';

const useGetAuthedUser = () => {
  return use(getSession());
};

export default useGetAuthedUser;
