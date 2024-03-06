import Board from '~/app/_components/board';
import { authorQuoteMap } from '~/app/dashboard/project/[projectId]/_data';

const Page = () => {
  return <Board data={authorQuoteMap} />;
};

export default Page;
