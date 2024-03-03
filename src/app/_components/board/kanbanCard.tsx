import { Box, Paper, Text } from '@mantine/core';
import { type CardProps } from '~/app/_components/board/kanban/types';

interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  url: string;
}

interface Quote {
  id: string;
  content: string;
  author: Author;
}

export const Item = (props: CardProps<Quote>) => {
  const { item, provided } = props;

  return (
    <Paper
      withBorder
      p="md"
      shadow="xs"
      radius="md"
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <Box>
        <Text>{item.content}</Text>
      </Box>
    </Paper>
  );
};
