'use client';

import { Loader } from '@mantine/core';
import Board from '~/app/_components/board';
import { api } from '~/trpc/react';

interface Props {
  params: {
    projectId: string;
  };
}

const Page = (props: Props) => {
  const project = api.issue.getProjectByShortCode.useQuery({
    shortcode: props.params.projectId,
  });

  if (project.isLoading) {
    return <Loader />;
  }

  if (project.data == null) {
    return <div>Project not found</div>;
  }

  return <Board data={{}} project={project.data} />;
};

export default Page;
